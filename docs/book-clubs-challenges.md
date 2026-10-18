# Modul Klub Buku & Komunitas (Fase 11)

Dokumen ini merinci arsitektur fitur **Klub Buku (Book Clubs)**, **Tantangan Baca (Reading Challenges)**, dan **Daftar Bacaan (Reading Lists)** untuk meningkatkan retensi dan memperkuat efek jaringan (*network effect*) di platform **Tukar & Pinjam**.

---

## 1. Fitur Utama Klub Buku
1. **Grup Berbasis Minat atau Kota**:
   * Pengguna dapat membuat atau bergabung dengan klub buku berdasarkan genre favorit (e.g., *Sci-Fi Enthusiasts*, *Filsafat Klasik*) atau basis geografis (e.g., *Klub Buku Bandung*, *Pembaca Jakarta Selatan*).
   * Status klub: Publik (siapa saja bisa bergabung) atau Privat (memerlukan persetujuan admin klub).

2. **Buku Bulanan (Book of the Month)**:
   * Admin/moderator klub dapat menetapkan satu atau lebih buku sebagai fokus bacaan bulan berjalan.
   * Tombol "Pinjam dari Sesama Anggota" otomatis memfilter anggota klub yang memiliki buku tersebut di rak mereka.

3. **Forum Diskusi Terstruktur**:
   * Ruang diskusi bertopik (misal: Bab 1-5, Diskusi Akhir Buku) dengan penanda *spoiler* agar tidak mengganggu anggota yang belum selesai membaca.

4. **Syarat Pinjam Khusus Anggota Klub**:
   * Pemilik buku dapat mengatur syarat peminjaman yang lebih longgar (misal: bebas biaya sewa atau tanpa deposit) khusus bagi anggota yang berada di dalam klub yang sama, memanfaatkan kepercayaan berbasis komunitas.

---

## 2. Tantangan Baca (Reading Challenges) & Gamifikasi
1. **Target Buku Tahunan / Bulanan**:
   * Pengguna dapat menyetel target personal (misal: "Target 12 Buku di 2026").
   * Buku yang dipinjam atau ditukar melalui aplikasi yang sudah berstatus `COMPLETED` otomatis dapat ditandai sebagai "Selesai Dibaca" untuk menambah progres tantangan.

2. **Lencana Prestasi (Badges)**:
   * *Kutu Buku Pemula*: Selesai membaca 3 buku.
   * *Penjelajah Genre*: Membaca buku dari 5 genre berbeda.
   * *Peminjam Teladan*: Menyelesaikan 5 peminjaman berturut-turut tanpa pernah terlambat (*zero overdue*).
   * Lencana ditampilkan di halaman profil pengguna untuk meningkatkan Trust Score.

---

## 3. Daftar Bacaan Bersama (Curated Reading Lists)
* Pengguna dapat membuat daftar bacaan tematik (misal: *"10 Buku Wajib untuk Penggemar Distopia"*).
* Daftar bacaan dapat dibagikan ke media sosial, disimpan (*bookmarked*) oleh pengguna lain, dan langsung menampilkan ketersediaan buku di sekitar lokasi pembaca.
