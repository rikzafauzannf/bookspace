-- ==============================================================================
-- TUKAR & PINJAM BUKU PLATFORM: CORE DATABASE SCHEMA & RLS POLICIES
-- Target: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. ENUMS
create type public.user_role as enum ('USER', 'ADMIN');
create type public.book_status as enum ('COLLECTION', 'OPEN_TRADE', 'AVAILABLE_FOR_RENT', 'RENTED', 'TRADED', 'LOST');
create type public.loan_status as enum (
  'REQUESTED',
  'APPROVED',
  'REJECTED',
  'CANCELLED_BY_BORROWER',
  'EXPIRED',
  'HANDED_OVER',
  'RETURN_PENDING',
  'RETURNED',
  'OVERDUE',
  'DISPUTED',
  'RESOLVED_RETURNED',
  'RESOLVED_LOST',
  'COMPLETED'
);
create type public.trade_status as enum (
  'OFFERED',
  'COUNTERED',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
  'EXPIRED',
  'AWAITING_HANDOVER',
  'DISPUTED',
  'COMPLETED'
);
create type public.handover_type as enum ('HANDOVER', 'RETURN');
create type public.report_target_type as enum ('USER', 'BOOK', 'POST', 'COMMENT', 'TRANSACTION');
create type public.report_status as enum ('PENDING', 'REVIEWED', 'RESOLVED');

-- ==============================================================================
-- 3. PROFILES (Linked to Supabase Auth)
-- ==============================================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  bio text,
  avatar_url text,
  phone_number text,
  city text not null default 'Jakarta Pusat',
  district text not null default 'Senen',
  latitude double precision,
  longitude double precision,
  trust_score integer default 50 check (trust_score >= 0 and trust_score <= 100),
  is_verified boolean default false,
  role public.user_role default 'USER' not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Function to handle new user signup automatically from auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile upon auth signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 4. BOOKS & COPIES
-- ==============================================================================
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  isbn text,
  title text not null,
  author text not null,
  publisher text,
  published_year integer,
  description text,
  condition integer check (condition >= 1 and condition <= 5) not null,
  language text default 'id' not null,
  genre text[] default array[]::text[],
  images text[] not null,
  status public.book_status default 'COLLECTION' not null,

  -- Rental Terms
  allow_rent boolean default false not null,
  rent_durations integer[] default array[7, 14, 30],
  deposit_amount numeric(12, 2) default 0.00 not null,
  shipping_payer text default 'borrower' not null,
  condition_rules text,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 5. LOANS (Peminjaman) & TRANSACTIONS
-- ==============================================================================
create table public.loans (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete restrict not null,
  initiator_id uuid references public.profiles(id) on delete restrict not null, -- Peminjam
  owner_id uuid references public.profiles(id) on delete restrict not null,     -- Pemilik
  status public.loan_status default 'REQUESTED' not null,
  duration_days integer not null check (duration_days > 0),
  deposit_amount numeric(12, 2) default 0.00 not null,
  due_date timestamptz,
  handed_over_at timestamptz,
  returned_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Constraint: Satu buku tidak boleh memiliki dua peminjaman aktif sekaligus!
create unique index if not exists unique_active_loan_per_book
  on public.loans (book_id)
  where status in ('REQUESTED', 'APPROVED', 'HANDED_OVER', 'RETURN_PENDING', 'OVERDUE', 'DISPUTED');

-- Audit Log Perubahan Status Transaksi
create table public.loan_history (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans(id) on delete cascade not null,
  from_status public.loan_status not null,
  to_status public.loan_status not null,
  actor_id uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz default now() not null
);

-- Handover & Return Verification Records (Bukti Foto 2 Pihak)
create table public.handover_records (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans(id) on delete cascade not null,
  record_type public.handover_type not null,
  images text[] not null,
  notes text,
  confirmed_by uuid[] default array[]::uuid[],
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 6. CHAT REALTIME (Per Transaksi)
-- ==============================================================================
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 7. REVIEWS & RATINGS
-- ==============================================================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  target_user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamptz default now() not null,
  unique (loan_id, reviewer_id)
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.loans enable row level security;
alter table public.loan_history enable row level security;
alter table public.handover_records enable row level security;
alter table public.chat_messages enable row level security;
alter table public.reviews enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are visible to authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- BOOKS POLICIES
create policy "Books are viewable by authenticated users"
  on public.books for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own books"
  on public.books for insert
  with check (auth.uid() = owner_id);

create policy "Users can update own books"
  on public.books for update
  using (auth.uid() = owner_id);

create policy "Users can delete own books"
  on public.books for delete
  using (auth.uid() = owner_id);

-- LOANS POLICIES (Hanya peminjam atau pemilik yang boleh melihat transaksi)
create policy "Users can view loans they are involved in"
  on public.loans for select
  using (auth.uid() = initiator_id or auth.uid() = owner_id);

create policy "Users can insert loan requests"
  on public.loans for insert
  with check (auth.uid() = initiator_id);

-- CHAT MESSAGES POLICIES (Hanya peserta transaksi yang boleh akses chat)
create policy "Participants can view transaction messages"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.loans
      where public.loans.id = chat_messages.loan_id
        and (public.loans.initiator_id = auth.uid() or public.loans.owner_id = auth.uid())
        and public.loans.status not in ('REQUESTED', 'REJECTED', 'CANCELLED_BY_BORROWER', 'EXPIRED')
    )
  );

create policy "Participants can insert transaction messages"
  on public.chat_messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.loans
      where public.loans.id = chat_messages.loan_id
        and (public.loans.initiator_id = auth.uid() or public.loans.owner_id = auth.uid())
        and public.loans.status not in ('REQUESTED', 'REJECTED', 'CANCELLED_BY_BORROWER', 'EXPIRED')
    )
  );

-- REVIEWS POLICIES
create policy "Anyone authenticated can view reviews"
  on public.reviews for select
  using (auth.role() = 'authenticated');

create policy "Participants can insert reviews on completed loans"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.loans
      where public.loans.id = reviews.loan_id
        and (public.loans.initiator_id = auth.uid() or public.loans.owner_id = auth.uid())
        and public.loans.status in ('RETURNED', 'COMPLETED')
    )
  );

-- ==============================================================================
-- 9. STORED PROCEDURES (CRITICAL STATE MACHINE LOGIC)
-- ==============================================================================

-- Stored Procedure: Approve Loan (Menyetujui Peminjaman & Otomatis Tolak Request Lain)
create or replace function public.approve_loan(p_loan_id uuid)
returns jsonb as $$
declare
  v_loan record;
  v_caller_id uuid := auth.uid();
begin
  -- 1. Ambil data loan dan kunci baris (Row Lock)
  select * into v_loan
  from public.loans
  where id = p_loan_id
  for update;

  if not found then
    raise exception 'Transaksi peminjaman tidak ditemukan.';
  end if;

  -- 2. Validasi otorisasi: Hanya pemilik yang berhak approve
  if v_loan.owner_id != v_caller_id then
    raise exception 'Hanya pemilik buku yang berhak menyetujui peminjaman.';
  end if;

  -- 3. Validasi state machine
  if v_loan.status != 'REQUESTED' then
    raise exception 'Hanya permintaan berstatus REQUESTED yang dapat disetujui.';
  end if;

  -- 4. Update status ke APPROVED
  update public.loans
  set status = 'APPROVED',
      updated_at = now()
  where id = p_loan_id;

  -- 5. Catat ke riwayat
  insert into public.loan_history (loan_id, from_status, to_status, actor_id, notes)
  values (p_loan_id, 'REQUESTED', 'APPROVED', v_caller_id, 'Permintaan disetujui oleh pemilik buku');

  -- 6. Otomatis tolak / batalkan permintaan lain untuk buku yang sama
  update public.loans
  set status = 'REJECTED',
      updated_at = now()
  where book_id = v_loan.book_id
    and id != p_loan_id
    and status = 'REQUESTED';

  return jsonb_build_object('success', true, 'loan_id', p_loan_id, 'status', 'APPROVED');
end;
$$ language plpgsql security definer;
