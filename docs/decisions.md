# Decisions

## 2026-10-18: Keputusan Awal Monorepo & Tech Stack
- **Monorepo**: Turborepo dipilih untuk kemudahan berbagi tipe dan validasi antara frontend (Next.js/Expo) dan backend (NestJS).
- **Manual Escrow (Deposit)**: Untuk MVP, deposit dana dilakukan secara manual untuk menghindari kompleksitas integrasi Payment Gateway & regulasi.
- **OTP**: WhatsApp dipilih sebagai saluran OTP karena tingkat konversi lebih tinggi untuk pengguna Indonesia dibanding SMS.
- **Lokasi**: Lokasi pengguna disimpan hingga tingkat Kecamatan untuk privasi, dengan koordinat latitude/longitude opsional untuk perhitungan radius pencarian.
- **MinIO**: Dipilih sebagai S3 storage lokal untuk pengembangan dan *self-hosting* gambar/foto kondisi buku.
