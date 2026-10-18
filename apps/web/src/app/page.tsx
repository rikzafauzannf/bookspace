'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BookCard } from '@/components/ui/BookCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

const MOCK_BOOKS = [
  {
    id: '1',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    status: 'AVAILABLE_FOR_RENT' as const,
    condition: 5,
    ownerName: 'Dimas Surya',
    ownerCity: 'Kec. Senen, Jakarta Pusat (2.4 km)',
    ownerTrustScore: 98,
  },
  {
    id: '2',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    status: 'OPEN_TRADE' as const,
    condition: 4,
    ownerName: 'Rikza Fauzan',
    ownerCity: 'Bandung',
    ownerTrustScore: 95,
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
  const [activeTab, setActiveTab] = useState<'catalog' | 'onboarding' | 'detail' | 'requests' | 'chat' | 'profile'>('catalog');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] font-sans flex flex-col selection:bg-[#C85A32] selection:text-white">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5C4033] text-white px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6D5C3] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="w-10 h-10 rounded-xl bg-[#5C4033] text-white flex items-center justify-center text-xl shadow-sm">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-extrabold text-xl text-[#5C4033] tracking-tight">TukarBuku</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#C85A32]/10 text-[#C85A32] font-semibold rounded-full border border-[#C85A32]/25">Stitch Design Sync</span>
              </div>
              <p className="text-[11px] text-[#7A685D]">Perpustakaan Komunal & Berkelanjutan</p>
            </div>
          </div>

          {/* Interactive Navigation Tabs for 5 Core Flows */}
          <nav className="flex flex-wrap justify-center gap-1.5 text-xs font-semibold bg-[#F4EBE1]/80 p-1.5 rounded-2xl border border-[#E6D5C3]">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'catalog' ? 'bg-[#5C4033] text-white shadow-sm scale-105' : 'text-[#7A685D] hover:text-[#2C221E]'}`}
            >
              Koleksi Utama
            </button>
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'onboarding' ? 'bg-[#5C4033] text-white shadow-sm scale-105' : 'text-[#7A685D] hover:text-[#2C221E]'}`}
            >
              1. Onboarding
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'detail' ? 'bg-[#5C4033] text-white shadow-sm scale-105' : 'text-[#7A685D] hover:text-[#2C221E]'}`}
            >
              2. Detail Pinjam
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-[#5C4033] text-white shadow-sm scale-105' : 'text-[#7A685D] hover:text-[#2C221E]'}`}
            >
              3. Request Masuk
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-[#5C4033] text-white shadow-sm scale-105' : 'text-[#7A685D] hover:text-[#2C221E]'}`}
            >
              4. Chat & COD
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#5C4033] text-white shadow-sm scale-105' : 'text-[#7A685D] hover:text-[#2C221E]'}`}
            >
              5. Profil & Trust
            </button>
          </nav>
        </div>
      </header>

      {/* Dynamic Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* ================= VIEW: MAIN CATALOG ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-12">
            <section className="max-w-4xl mx-auto text-center space-y-6 pt-6 bg-gradient-to-b from-[#F4EBE1]/40 to-transparent p-8 rounded-3xl border border-[#E6D5C3]/60 shadow-xs">
              <Badge variant="trade" className="text-xs uppercase tracking-wide">
                ✨ Terhubung dengan Stitch Design System
              </Badge>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#5C4033] leading-tight">
                Perpustakaan Hangat di Sekitar Tempat Tinggalmu
              </h1>
              <p className="text-sm sm:text-base text-[#7A685D] max-w-2xl mx-auto leading-relaxed">
                Pinjam dan tukar buku fisik favoritmu dengan sesama pembaca terpercaya. Dilengkapi sistem skor reputasi, scan ISBN instan, dan verifikasi foto serah terima aman.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Button size="lg" variant="primary" onClick={() => setActiveTab('detail')}>Jelajahi Koleksi Buku</Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab('onboarding')}>Scan & Tambah Buku</Button>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-3">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#5C4033]">Buku Tersedia di Sekitarmu</h2>
                  <p className="text-xs text-[#7A685D]">Berdasarkan jarak dan reputasi pemilik buku</p>
                </div>
                <button onClick={() => setActiveTab('detail')} className="text-xs font-semibold text-[#C85A32] hover:underline">
                  Lihat Semua →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {MOCK_BOOKS.map((book) => (
                  <div key={book.id} onClick={() => setActiveTab('detail')} className="cursor-pointer transform hover:-translate-y-1 transition-all">
                    <BookCard {...book} />
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-[#E6D5C3]">
                <h3 className="font-serif text-lg font-bold text-[#5C4033] mb-4">Preview Tampilan Rak Kosong (Empty State):</h3>
                <EmptyState
                  title="Belum Ada Buku di Sekitarmu"
                  description="Jadilah yang pertama menambahkan koleksi buku di area ini dan mulai bangun reputasimu di komunitas!"
                  actionText="Tambah Buku Pertamamu"
                  onAction={() => setActiveTab('onboarding')}
                />
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 1: ONBOARDING (3 BUKU) ================= */}
        {activeTab === 'onboarding' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs space-y-1 shadow-xs">
              <span className="font-bold text-amber-900 block">Stitch Flow 1: Onboarding Rak Awal</span>
              <p className="text-amber-800">Syarat minimal 3 buku awal untuk membuka akses peminjaman di komunitas.</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-md p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#5C4033]">Yuk, isi rak bukumu!</h2>
                  <p className="text-xs text-[#7A685D] mt-1">Scan barcode atau masukkan ISBN buku koleksimu.</p>
                </div>
                <span className="text-xs bg-[#5C4033] text-white px-3 py-1 rounded-full font-semibold">2 / 3 Buku</span>
              </div>

              <div>
                <div className="w-full bg-[#F4EBE1] h-3 rounded-full overflow-hidden">
                  <div className="bg-[#C85A32] h-3 rounded-full transition-all duration-500" style={{ width: '66%' }}></div>
                </div>
                <span className="text-xs text-[#7A685D] mt-1.5 inline-block font-medium">Tersisa 1 buku lagi untuk mulai meminjam</span>
              </div>

              <div className="border-2 border-dashed border-[#E6D5C3] rounded-2xl p-6 text-center bg-[#FDFBF7] hover:bg-[#F4EBE1]/50 transition cursor-pointer">
                <div className="w-12 h-12 bg-[#5C4033]/10 text-[#5C4033] rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                  📷
                </div>
                <h4 className="font-bold text-sm text-[#5C4033]">Scan Barcode / ISBN Buku</h4>
                <p className="text-xs text-[#7A685D] mt-1">Arahkan kamera ke barcode sampul belakang buku</p>
                <Button variant="primary" className="mt-4 w-full" onClick={() => showToast('Kamera pemindai ISBN berhasil dibuka!')}>Buka Kamera Pemindai</Button>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A685D]">Buku yang Sudah Ditambahkan</span>
                <div className="flex items-center gap-3 p-3 bg-[#FDFBF7] rounded-xl border border-[#E6D5C3]">
                  <div className="w-12 h-16 bg-[#5C4033]/20 rounded flex items-center justify-center text-[10px] text-[#7A685D] font-serif">Cover</div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#2C221E] truncate">Laskar Pelangi</h5>
                    <p className="text-[11px] text-[#7A685D]">Andrea Hirata</p>
                    <Badge variant="rent" className="mt-1">Bisa Dipinjam</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#FDFBF7] rounded-xl border border-[#E6D5C3]">
                  <div className="w-12 h-16 bg-[#5C4033]/20 rounded flex items-center justify-center text-[10px] text-[#7A685D] font-serif">Cover</div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#2C221E] truncate">Bumi Manusia</h5>
                    <p className="text-[11px] text-[#7A685D]">Pramoedya Ananta Toer</p>
                    <Badge variant="trade" className="mt-1">Open Trade</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: DETAIL BUKU & PINJAM ================= */}
        {activeTab === 'detail' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs space-y-1 shadow-xs">
              <span className="font-bold text-amber-900 block">Stitch Flow 2: Detail Buku & Syarat Peminjaman</span>
              <p className="text-amber-800">Menampilkan transparansi kondisi buku, pemilik terverifikasi, dan jaminan.</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-md overflow-hidden">
              <div className="relative bg-[#F4EBE1] p-8 flex items-center justify-center min-h-[240px]">
                <div className="w-32 h-48 bg-[#5C4033] shadow-xl rounded-md flex items-center justify-center text-white font-serif text-sm p-4 text-center">
                  Filosofi Teras
                </div>
                <span className="absolute top-4 right-4 text-xs bg-emerald-700 text-white font-semibold px-3 py-1 rounded-full shadow-sm">Bisa Dipinjam</span>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#5C4033]">Filosofi Teras</h2>
                  <p className="text-xs text-[#7A685D] mt-0.5">Henry Manampiring • Kompas Buku</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-amber-500 text-xs">★★★★★</span>
                    <span className="text-[11px] text-[#7A685D] font-medium">Kondisi 5/5 (Mulus, terawat)</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E6D5C3] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#5C4033] text-white font-bold text-xs flex items-center justify-center">DS</div>
                    <div>
                      <h5 className="text-xs font-bold text-[#5C4033]">Dimas Surya</h5>
                      <p className="text-[10px] text-[#7A685D]">Kec. Senen, Jakarta Pusat (± 2.4 km)</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Skor 98%</span>
                </div>

                <div className="space-y-2.5 text-xs border-t border-[#E6D5C3] pt-4">
                  <h4 className="font-bold text-[#5C4033] text-xs">Syarat Peminjaman:</h4>
                  <div className="flex justify-between text-[#7A685D]">
                    <span>Pilihan Durasi:</span>
                    <span className="font-semibold text-[#2C221E]">7 / 14 / 30 Hari</span>
                  </div>
                  <div className="flex justify-between text-[#7A685D]">
                    <span>Deposit Jaminan:</span>
                    <span className="font-semibold text-[#2C221E]">Rp 30.000 (Dikembalikan penuh)</span>
                  </div>
                  <div className="flex justify-between text-[#7A685D]">
                    <span>Serah Terima:</span>
                    <span className="font-semibold text-[#2C221E]">COD Area Senen / Ongkir Peminjam</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="primary" className="w-full py-3" onClick={() => { showToast('Pengajuan pinjam terkirim!'); setActiveTab('requests'); }}>
                    Ajukan Pinjam Buku Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: REQUEST MASUK ================= */}
        {activeTab === 'requests' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs space-y-1 shadow-xs">
              <span className="font-bold text-amber-900 block">Stitch Flow 3: Kotak Masuk Request (Pemilik)</span>
              <p className="text-amber-800">Evaluasi pemohon pinjam berdasarkan skor kepercayaan & ulasan komunitas.</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-md overflow-hidden">
              <div className="bg-[#FDFBF7] px-6 py-4 border-b border-[#E6D5C3] flex items-center justify-between">
                <h2 className="font-serif text-base font-bold text-[#5C4033]">Permintaan Masuk</h2>
                <span className="text-xs bg-[#C85A32] text-white px-2 py-0.5 rounded-full font-bold">1 Baru</span>
              </div>

              <div className="p-6 space-y-4">
                <div className="border border-[#E6D5C3] rounded-2xl p-4 bg-[#FDFBF7]/60 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C85A32] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">RF</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#5C4033]">Rikza Fauzan</h4>
                        <span className="text-[10px] text-[#7A685D]">5 mnt lalu</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Skor 95%</span>
                        <span className="text-[10px] text-[#7A685D]">• 12 Transaksi Berhasil</span>
                      </div>
                      <p className="text-xs text-[#2C221E] mt-2.5">
                        &quot;Halo! Saya ingin meminjam buku <strong>Laskar Pelangi</strong> selama 14 hari. Siap COD langsung di sekitar Senen.&quot;
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#E6D5C3] text-[11px] space-y-1">
                    <div className="flex justify-between"><span className="text-[#7A685D]">Buku:</span><span className="font-medium">Laskar Pelangi</span></div>
                    <div className="flex justify-between"><span className="text-[#7A685D]">Durasi:</span><span className="font-medium">14 Hari</span></div>
                    <div className="flex justify-between"><span className="text-[#7A685D]">Jaminan:</span><span className="font-medium">Rp 25.000</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <Button variant="outline" size="sm" onClick={() => showToast('Permintaan ditolak')}>Tolak</Button>
                    <Button variant="primary" size="sm" onClick={() => { showToast('Permintaan disetujui!'); setActiveTab('chat'); }}>Setujui & Buka Chat</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: CHAT & SERAH TERIMA ================= */}
        {activeTab === 'chat' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs space-y-1 shadow-xs">
              <span className="font-bold text-amber-900 block">Stitch Flow 4: Transaksi Aktif & Foto Serah Terima</span>
              <p className="text-amber-800">Koordinasi COD dan lampiran bukti foto kondisi fisik buku.</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-md overflow-hidden flex flex-col h-[580px]">
              <div className="bg-[#5C4033] text-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">Status: Disetujui</span>
                  <span className="text-xs font-medium">Jatuh Tempo: 14 Hari</span>
                </div>
                <h4 className="text-sm font-bold mt-1">Laskar Pelangi (Peminjam: Rikza F.)</h4>
                <div className="flex items-center gap-1.5 mt-3 text-[10px]">
                  <span className="px-2 py-0.5 bg-white text-[#5C4033] rounded-full font-bold">1. Disetujui</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-[#4A3328] text-amber-100 rounded-full font-medium">2. Serah Terima</span>
                  <span>→</span>
                  <span className="text-amber-200/60">3. Kembali</span>
                </div>
              </div>

              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
                <span>Wajib foto kondisi fisik saat serah terima</span>
                <button onClick={() => showToast('Foto kondisi buku berhasil diunggah!')} className="bg-amber-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">Ambil Foto</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FDFBF7]/40 text-xs">
                <div className="text-center my-2"><span className="bg-[#E6D5C3]/60 text-[10px] text-[#7A685D] px-3 py-1 rounded-full">Chat dibuka otomatis karena request disetujui</span></div>

                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-6 h-6 rounded-full bg-[#C85A32] text-white text-[9px] flex items-center justify-center flex-shrink-0">RF</div>
                  <div className="bg-white p-2.5 rounded-2xl rounded-tl-none border border-[#E6D5C3] text-[#2C221E]">
                    Halo Mas Dimas, bisa COD di Kopi Kenangan Senen jam 4 sore ini?
                  </div>
                </div>

                <div className="flex items-start gap-2 max-w-[80%] ml-auto flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-[#5C4033] text-white text-[9px] flex items-center justify-center flex-shrink-0">DS</div>
                  <div className="bg-[#5C4033] text-white p-2.5 rounded-2xl rounded-tr-none">
                    Bisa banget Mas Rikza! Sampai ketemu di sana ya. Jangan lupa cek kondisi buku bareng nanti.
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-[#E6D5C3] bg-white flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-[#FDFBF7] border border-[#E6D5C3] flex items-center justify-center text-[#7A685D] text-sm">📷</button>
                <input type="text" placeholder="Ketik pesan koordinasi..." className="flex-1 border border-[#E6D5C3] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5C4033]" />
                <button onClick={() => showToast('Pesan terkirim')} className="w-9 h-9 rounded-full bg-[#5C4033] text-white flex items-center justify-center text-xs font-bold">➤</button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: PROFIL & TRUST SCORE ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs space-y-1 shadow-xs">
              <span className="font-bold text-amber-900 block">Stitch Flow 5: Profil Pembaca & Trust Score</span>
              <p className="text-amber-800">Transparansi reputasi, skor kepercayaan, dan lencana prestasi komunitas.</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-md p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-[#5C4033] text-white font-bold text-2xl rounded-full flex items-center justify-center mx-auto border-4 border-[#FDFBF7] shadow-sm">
                    RF
                  </div>
                  <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[10px] p-1 rounded-full border-2 border-white">✓</span>
                </div>
                <h2 className="font-serif text-xl font-bold text-[#5C4033]">Rikza Fauzan</h2>
                <p className="text-xs text-[#7A685D]">Kec. Senen, Jakarta Pusat • Bergabung Mei 2026</p>
              </div>

              <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F4EBE1] p-5 rounded-2xl border border-[#E6D5C3] text-center shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A685D]">Skor Kepercayaan Komunitas</span>
                <div className="text-4xl font-black text-[#5C4033] my-1">95<span className="text-lg font-normal text-[#7A685D]">/100</span></div>
                <p className="text-[11px] text-emerald-800 font-medium">Pembaca Terpercaya (Peminjam Teladan)</p>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E6D5C3]/60 text-[11px]">
                  <div><span className="font-bold block text-[#2C221E]">12</span><span className="text-[#7A685D] text-[10px]">Selesai</span></div>
                  <div><span className="font-bold block text-[#2C221E]">100%</span><span className="text-[#7A685D] text-[10px]">Tepat Waktu</span></div>
                  <div><span className="font-bold block text-[#2C221E]">4.9 ★</span><span className="text-[#7A685D] text-[10px]">Rating</span></div>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A685D]">Lencana Prestasi</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-1">🎖️ 5x Tepat Waktu</span>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-900 rounded-xl text-xs font-semibold flex items-center gap-1">📚 Kolektor 10+</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A685D]">Ulasan Pembaca Lain</span>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E6D5C3] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2C221E]">Dimas Surya</span>
                    <span className="text-amber-500 text-[10px]">★★★★★</span>
                  </div>
                  <p className="text-[#7A685D] text-[11px]">&quot;Buku dikembalikan dalam kondisi sangat terawat dan tepat waktu. Terima kasih banyak!&quot;</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Sticky Responsive Footer */}
      <footer className="mt-auto border-t border-[#E6D5C3] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A685D]">
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span className="font-serif font-bold text-[#5C4033]">TukarBuku Platform</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:underline cursor-pointer">Panduan Keamanan</span>
            <span className="hover:underline cursor-pointer">Bantuan Stitch</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
