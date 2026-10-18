# Modul Logistik & Titik Temu (COD) - Draf Spesifikasi

Dokumen ini merinci rancangan teknis untuk integrasi logistik kurir (ekspedisi & instant delivery) serta fitur titik temu aman (COD) untuk platform **Tukar & Pinjam**.

---

## 1. Integrasi Agregator Kurir (Biteship / RajaOngkir)
Untuk mengakomodasi pengiriman buku antar-kecamatan atau antar-kota, platform memerlukan integrasi dengan agregator logistik (seperti Biteship).

### Alur Kerja Pengiriman:
1. **Estimasi Ongkir Saat Checkout / Request**:
   * Peminjam memasukkan alamat tujuan (Kecamatan/Kode Pos).
   * Sistem memanggil API kurir berdasarkan titik asal pemilik buku untuk mendapatkan daftar pilihan layanan (Reguler, Next Day, Instant).
   * Pihak yang menanggung ongkir (`shippingPayer` dari data buku: `borrower`, `owner`, atau `split`) menentukan siapa yang membayar komponen ongkir ini.
2. **Pembuatan Label Pengiriman (Waybill / Resi)**:
   * Setelah request disetujui (`APPROVED`), pemilik buku menekan tombol "Buat Pengiriman" (*Create Order*).
   * Sistem menghasilkan nomor resi otomatis dari kurir mitra dan menampilkan instruksi *drop-off* atau *pickup*.
3. **Pelacakan (Tracking) di Dalam Transaksi**:
   * Status resi dilacak via webhook kurir atau *polling* berkala, dan ditampilkan secara *real-time* di layar detail transaksi aplikasi (`REQUESTED` -> `SHIPPED` -> `DELIVERED`).

---

## 2. Fitur "Titik Temu" (Safe Meetup Points for COD)
Untuk transaksi dalam satu kota/kecamatan, pengguna sering kali memilih *Cash on Delivery* (COD) atau serah terima langsung demi menghemat ongkir. Untuk alasan keamanan (Trust & Safety), platform menyediakan rekomendasi **Titik Temu Resmi** (misal: kafe rekanan, perpustakaan publik, atau minimarket mitra yang terang dan ramai).

### Skema Database Titik Temu (Prisma):
```prisma
model MeetupPoint {
  id          String   @id @default(uuid())
  name        String   // Nama tempat (e.g. "Kopi Buku Senopati")
  cityId      String
  address     String
  latitude    Float
  longitude   Float
  description String?  // e.g. "Bertemu di area kasir/lobi"
  isVerified  Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

### Fitur di Aplikasi:
* Saat transaksi disetujui dan kedua pihak sepakat untuk bertemu langsung, aplikasi menampilkan pilihan **Titik Temu Terdekat** berdasarkan koordinat rata-rata kedua pengguna.
* Pengguna dapat memilih titik temu tersebut sebagai lokasi serah terima resmi di dalam detail transaksi, meminimalkan risiko penipuan atau pertemuan di tempat sunyi.
