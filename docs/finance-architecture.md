# Catatan Integrasi Payment Gateway (Midtrans/Xendit) - Draf Keuangan

Dokumen ini memuat draf arsitektur integrasi pembayaran untuk penanganan **Deposit Keamanan** (Security Deposit) dan **Biaya Layanan Platform** secara aman, idempotent, dan dapat diaudit (*auditable ledger*).

---

## 1. Arsitektur Keuangan & Ledger
Untuk memastikan konsistensi finansial dan mencegah *race condition*, seluruh pergerakan uang wajib dicatat dalam tabel `LedgerEntry` (*double-entry bookkeeping principle* sederhana).

### Skema Database Keuangan (Prisma)
- **`Payment`**: Menyimpan token/snap URL dari Midtrans/Xendit, status pembayaran (`PENDING`, `SETTLED`, `REFUNDED`, `DISPUTED`).
- **`LedgerEntry`**: Catatan mutasi (debit/kredit) yang tidak bisa diubah (*immutable*).

---

## 2. Alur Transaksi Deposit & Biaya Layanan
1. **Request Dibuat**: Peminjam menyetujui syarat sewa + deposit. Sistem memanggil API Midtrans Core/Snap untuk membuat *payment link* sebesar `(Rental Fee + Deposit + Platform Fee)`.
2. **Dana Ditahan (Escrow Simulation)**:
   * Saat status webhook `settlement` diterima, dana dianggap masuk ke rekening penampungan perantara.
   * Status transaksi berubah dari `REQUESTED` ke `APPROVED` / `HANDED_OVER`.
3. **Penyelesaian Normal (Pengembalian Sempurna)**:
   * Buku dikembalikan dengan kondisi baik.
   * Pemilik mengonfirmasi pengembalian (`RETURNED` -> `COMPLETED`).
   * Sistem memicu API *Refund* otomatis ke Midtrans/Xendit untuk mengembalikan dana **Deposit** secara penuh ke peminjam.
4. **Sengketa (Dispute / Buku Rusak)**:
   * Jika terjadi kerusakan, pemilik mengajukan sengketa. Admin meninjau bukti foto.
   * Admin memutuskan apakah deposit dicairkan sebagian/seluruhnya kepada pemilik atau dikembalikan ke peminjam.

---

## 3. Webhook Idempotency & Verifikasi Tanda Tangan
* **Verifikasi Signature**: Setiap webhook yang masuk dari Midtrans/Xendit wajib diverifikasi menggunakan *Signature Key* (`SHA512(order_id + status_code + gross_amount + ServerKey)`) di level *Guard/Middleware*.
* **Idempotency**: Webhook diproses dengan pengecekan status pembayaran sebelumnya. Jika event yang sama dikirim dua kali oleh gateway, sistem mengabaikannya (*no-op*) untuk mencegah duplikasi mutasi ledger.
* **PCI-DSS Compliance**: Aplikasi **TIDAK PERNAH** menyimpan nomor kartu kredit atau data sensitif alat pembayaran. Seluruh transaksi dialihkan sepenuhnya ke halaman *Hosted Checkout* resmi milik Midtrans/Xendit.

---

## 4. Risiko Hukum & Pajak yang Wajib Ditanyakan ke Ahli (Legal/Tax Disclaimer)

> **Peringatan**: Bagian ini adalah rangkuman risiko operasional. Anda **wajib** berkonsultasi dengan konsultan pajak dan ahli hukum Indonesia sebelum mengaktifkan fitur pembayaran real.

1. **Status Hukum Perantara / Escrow di Indonesia**:
   * *Pertanyaan ke Ahli*: Apakah memegang dana pihak ketiga (eskrow deposit) dalam bentuk apa pun tanpa izin khusus dari Bank Indonesia (sebagai Penyelenggara Jasa Pembayaran / PJP) melanggar regulasi BI? (Alternatif aman: Menggunakan skema *split payment* langsung di level Payment Gateway).
2. **Kewajiban Pajak Pertambahan Nilai (PPN) & PPh atas Biaya Layanan Platform**:
   * *Pertanyaan ke Ahli*: Bagaimana perlakuan pajak untuk *platform fee* yang dipotong dari transaksi sewa antar-individu (C2C)? Apakah platform wajib dikukuhkan sebagai Pengusaha Kena Pajak (PKP) dan memungut PPN?
3. **Pertanggungjawaban Hukum atas Kerusakan Fisik Buku**:
   * *Pertanyaan ke Ahli*: Apakah pemotongan deposit sepihak oleh platform berdasarkan klaim kerusakan dari pemilik buku memiliki kekuatan mengikat secara hukum perdata di Indonesia jika terjadi gugatan dari peminjam?
