# Audit Keamanan - Tukar & Pinjam Platform

## 1. Autentikasi & Manajemen Sesi
- **Temuan**: Token JWT tidak dirotasi secara otomatis kecuali melalui endpoint `refresh`. Tidak ada mekanisme `blacklist` token secara *real-time* di cache (Redis) untuk token yang sudah di-*revoke*.
- **Bukti**: `auth.service.ts` hanya memeriksa `refreshToken` di DB, tanpa cache Redis untuk *revocation* instan.
- **Perbaikan**: Tambahkan verifikasi `isRevoked` token ke Redis pada `JwtStrategy` untuk memangkas DB hit setiap request.

## 2. Otorisasi (IDOR)
- **Temuan**: Endpoint `GET /transactions/:id` dan `PATCH /transactions/:id/*` sudah memeriksa apakah `userId` adalah pemilik/initiator. Namun, pada `ChatGateway`, verifikasi masih *basic*.
- **Bukti**: `transactions.service.ts` sudah aman. `chat.gateway.ts` aman karena memverifikasi akses transaksi.
- **Perbaikan**: Tambahkan `UseGuards(JwtAuthGuard)` ke `ChatGateway` agar identitas socket terikat dengan user ID yang valid.

## 3. Validasi Input & File
- **Temuan**: File upload (foto buku/kondisi) belum ada filter tipe file (hanya validasi URL Zod).
- **Bukti**: `CreateBookInput` hanya memvalidasi `z.array(z.string().url())`.
- **Perbaikan**: Implementasikan *middleware* validasi untuk *upload stream* ke MinIO/S3 (tipe, ukuran maks).

## 4. Rate Limiting
- **Temuan**: `ThrottlerModule` sudah ada di `AppModule`, tapi belum disesuaikan per endpoint sensitif.
- **Bukti**: `ThrottlerModule.forRoot` di `app.module.ts` menggunakan limit global.
- **Perbaikan**: Gunakan `@Throttle` decorator untuk memperketat endpoint `/auth/login`, `/auth/register`, dan `/auth/verify-otp`.

## 5. XSS (Konten Buatan Pengguna)
- **Temuan**: Konten ulasan dan chat disimpan mentah (`Post.content`, `ChatMessage.content`).
- **Bukti**: Tidak ada *sanitization* di service sebelum simpan ke DB.
- **Perbaikan**: Tambahkan `dompurify` atau sanitasi input di level API (service layer) sebelum `prisma.create`.

## 6. Kebocoran Data
- **Temuan**: Profil user saat ini mengembalikan `cityId`, `districtId` di semua endpoint profil.
- **Bukti**: `UsersService.findOne` hanya membuang `passwordHash`, tapi atribut lokasi masih ada.
- **Perbaikan**: Filter atribut sensitif secara eksplisit.
