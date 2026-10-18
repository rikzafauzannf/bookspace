'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { BookCard } from '@/components/ui/BookCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

// Mock data buku untuk preview visual tanpa backend
const MOCK_BOOKS = [
  {
    id: '1',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    status: 'AVAILABLE_FOR_RENT' as const,
    condition: 5,
    ownerName: 'Dimas Surya',
    ownerCity: 'Jakarta Pusat',
    ownerTrustScore: 98,
  },
  {
    id: '2',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    status: 'OPEN_TRADE' as const,
    condition: 4,
    ownerName: 'Siti Rahma',
    ownerCity: 'Bandung',
    ownerTrustScore: 92,
  },
  {
    id: '3',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    coverUrl: '',
    status: 'RENTED' as const,
    condition: 4,
    ownerName: 'Ahmad Fauzi',
    ownerCity: 'Yogyakarta',
    ownerTrustScore: 89,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] font-sans pb-16">

      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#E6D5C3]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="font-serif font-bold text-xl text-[#5C4033]">TukarBuku</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">Masuk</Button>
          <Button variant="primary" size="sm">Mulai Baca</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-10 text-center space-y-4">
        <Badge variant="trade" className="text-xs uppercase tracking-wide">
          Komunitas Pembaca Lokal
        </Badge>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#5C4033] leading-tight">
          Perpustakaan Hangat di Sekitar Tempat Tinggalmu
        </h1>
        <p className="text-base text-[#7A685D] max-w-xl mx-auto leading-relaxed">
          Pinjam dan tukar buku fisik favoritmu dengan sesama pembaca terpercaya. Dilengkapi sistem skor reputasi dan foto serah terima aman.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button size="lg" variant="primary">Jelajahi Koleksi</Button>
          <Button size="lg" variant="outline">Scan & Tambah Buku</Button>
        </div>
      </header>

      {/* Book Catalog Section (Live UI Preview) */}
      <main className="max-w-6xl mx-auto px-6 mt-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#5C4033]">Buku Tersedia di Sekitarmu</h2>
            <p className="text-xs text-[#7A685D]">Berdasarkan jarak dan reputasi pemilik buku</p>
          </div>
          <span className="text-xs font-semibold text-[#C85A32] cursor-pointer hover:underline">
            Lihat Semua →
          </span>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_BOOKS.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

        {/* Empty State Showcase */}
        <div className="mt-12 pt-6">
          <h3 className="font-serif text-base font-bold text-[#5C4033] mb-4">Preview Tampilan Jika Rak Kosong (Empty State):</h3>
          <EmptyState
            title="Belum Ada Buku di Sekitarmu"
            description="Jadilah yang pertama menambahkan koleksi buku di area ini dan mulai bangun reputasimu di komunitas!"
            actionText="Tambah Buku Pertamamu"
            onAction={() => alert('Aksi Tambah Buku!')}
          />
        </div>
      </main>

    </div>
  );
}
