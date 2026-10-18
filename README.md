# TukarBuku - Komunitas Pinjam & Tukar Buku Physical

Aplikasi komunitas membaca fisik dengan nuansa **"The Warm Library"** (hangat, ramah, dan ramah pengguna).

---

## 🚀 Cara Menjalankan & Melihat Tampilan Aplikasi (Frontend First)

Anda dapat langsung melihat tampilan UI tanpa perlu mengatur database atau backend terlebih dahulu!

### 1. Instalasi Dependensi
Jalankan perintah ini di root folder proyek:
```bash
pnpm install
```

### 2. Cara Buka & Lihat Tampilan Web di Browser
Jalankan dev server aplikasi Web (Next.js):
```bash
pnpm --filter @app/web dev
```
Buka browser Anda dan akses:
👉 **`http://localhost:3000`**

Di sana Anda akan melihat **Halaman Utama / Landing Page** dengan komponen-komponen UI "The Warm Library" (Button, Card Buku, Badge Status, dll).

---

### 3. Cara Buka Prototype Wireframe Interaktif (Langsung Tanpa Server)
Anda juga memiliki file wireframe interaktif satu-halaman yang mencakup 5 Alur Inti:
1. Buka folder proyek `E:\code\post-pro\` di File Explorer.
2. Klik ganda file **`wireframe.html`** atau **`wireframe-v2.html`**.
3. File akan langsung terbuka di browser Anda (Chrome/Edge/Firefox) tanpa perlu menjalankan perintah server apa pun!

---

### 4. Cara Buka Tampilan Mobile (React Native / Expo)
Untuk melihat tampilan mobile:
```bash
pnpm --filter @app/mobile start
```
1. Unduh aplikasi **Expo Go** di HP Android / iOS Anda dari App Store / Play Store.
2. Scan **QR Code** yang muncul di terminal Anda menggunakan kamera HP / Expo Go.

---

## 🎨 Design System: The Warm Library

Semua komponen UI menggunakan token warna hangat:
- **Primary**: Cokelat Kayu (`#5C4033`)
- **Secondary**: Terracotta (`#C85A32`)
- **Background**: Kertas Krem (`#FDFBF7`)
- **Font**: Merriweather (Headings) + Inter (Body)

Dokumentasi lengkap design system dapat dibaca di `/docs/design-system.md`.
