# Panduan Design System: The Warm Library

Design System ini dirancang khusus untuk platform komunitas membaca **Tukar & Pinjam** dengan nuansa yang hangat, ramah, dan bernuansa *perpustakaan modern*.

---

## 1. Tiga Opsi Arah Visual

### Opsi A: The Warm Library (Rekomendasi Utama 🏆)
*   **Mood**: Mengingatkan pada aroma buku, rak kayu jati, dan lampu baca kuning hangat.
*   **Palet Warna**:
    *   Primary: `#5C4033` (Warm Wood)
    *   Secondary: `#C85A32` (Terracotta)
    *   Background: `#FDFBF7` (Warm Paper)
    *   Text: `#2C221E` (Warm Charcoal)
*   **Tipografi**: `Merriweather` (Headings) + `Inter` (Body).
*   **Gaya Ilustrasi**: Line art halus ala sketsa buku tua.
*   **Nada Bahasa**: Hangat, bersahabat, seperti pustakawan ramah.
*   **Alasan Rekomendasi**: Menumbuhkan rasa aman, nyaman, dan ikatan emosional mendalam antar-pembaca buku fisik.

### Opsi B: Forest Botanist
*   **Mood**: Santai, teduh, terinspirasi oleh sudut baca di kafe taman.
*   **Palet Warna**: Forest Green (`#2F4F4F`), Sage (`#8FBC8F`), Warm White (`#F4F6F4`).
*   **Tipografi**: `Playfair Display` + `Plus Jakarta Sans`.

### Opsi C: Retro Indie Bookstore
*   **Mood**: Ceria, eksentrik, toko buku independen era 90-an.
*   **Palet Warna**: Mustard (`#F4A261`), Deep Teal (`#264653`), Coral (`#E76F51`).
*   **Tipografi**: `Space Grotesk` + `Work Sans`.

---

## 2. Design Tokens (Spesifikasi Teknis)
Semua token didefinisikan di `@app/ui` (`packages/ui/src/tokens.ts`):
*   **Warna Semantik**: Tersedia untuk mode terang (`light`) dan mode gelap (`dark`).
*   **Spacing**: Menggunakan skala modular kelipatan 4 (`xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `xxl: 48`).
*   **Radius Sudut**: `sm: 6px`, `md: 12px`, `lg: 20px`, `full: 9999px`.
*   **Aksesibilitas Kontras**: Kontras teks arang (`#2C221E`) di atas kertas krem (`#FDFBF7`) mencapai rasio > 11:1 (Jauh melampaui standar WCAG AA 4.5:1).
*   **Touch Targets**: Minimum **44px** untuk seluruh tombol, form input, dan komponen interaktif mobile.

---

## 3. Komponen Dasar & Panduan Penggunaan

### A. Button
*   Tinggi minimum: `44px` atau `48px`.
*   Varian: `primary` (latar kayu hangat), `secondary` (terracotta), `outline`, dan `ghost`.
*   Loading state: Menampilkan indikator berputar lembut tanpa mengubah lebar tombol.

### B. Input
*   Padding internal yang lega (minimal `12px` vertikal) agar nyaman disentuh jari.
*   Border lembut (`#E6D5C3`) dengan fokus state ring primary.

### C. Card Buku
*   Rasio gambar cover buku standar 2:3.
*   Menampilkan badge status ketersediaan di pojok kanan atas.
*   Menampilkan indikator rating bintang dan nama pemilik buku.

### D. Badge Status
*   **Open Trade**: Warna Terracotta lembut.
*   **Bisa Dipinjam**: Warna Hijau Daun Hutan (`#2E7D32`).
*   **Sedang Dipinjam**: Warna Abu-abu Muted (`#7A685D`).

### E. Avatar & Trust Score Badge
*   Avatar melingkar dengan cincin warna emas/perunggu sesuai tingkatan Trust Score pengguna.

### F. Empty State & Skeleton Loader
*   Empty state menyertakan ilustrasi bertema buku dan teks Call-to-Action (CTA) yang ramah.
*   Skeleton loader meniru bentuk card buku dan feed dengan animasi shimmer lembut.
