# Sistem Rekomendasi Buku & Pembaca (Fase 12)

Pendekatan rekomendasi awal menggunakan metode **Content-Based Filtering** terbobot (*weighted scoring*) yang deterministik, murah secara komputasi, dan mudah diukur tanpa memerlukan LLM/vektor embedding terlebih dahulu.

---

## 1. Algoritma Pembobotan Rekomendasi Buku
Skor rekomendasi dihitung berdasarkan kombinasi atribut:
*   **Wishlist Match (+50 poin)**: ISBN buku persis sama dengan wishlist pengguna.
*   **Wishlist Title Fuzzy Match (+30 poin)**: Judul buku mengandung kata kunci dari wishlist pengguna.
*   **Genre Match (+10 poin per genre)**: Kesamaan genre buku dengan koleksi yang sudah dimiliki pengguna.
*   **Kedekatan Lokasi (+15 poin)**: Buku dimiliki oleh pengguna di Kota yang sama.
*   **Faktor Kepercayaan (+ TrustScore / 10)**: Pemilik dengan Trust Score tinggi diprioritaskan.

---

## 2. Perlindungan Privasi Data Pengguna
*   Rekomendasi pembaca hanya menampilkan **Nama**, **Avatar**, **Bio singkat**, **Kota/Kecamatan**, dan **Trust Score**.
*   **Nomor telepon, email, alamat lengkap, dan koordinat presisi (lat/long) disembunyikan secara absolut** hingga transaksi bilateral disetujui.

---

## 3. Evaluasi Metrik & Dampak terhadap Transaksi (A/B Testing Framework)
Untuk membuktikan apakah rekomendasi meningkatkan transaksi:
1.  **Metrik Utama (North Star)**:
    *   **Conversion Rate (CVR)**: Persentase klik rekomendasi yang berujung pada pembuatan request transaksi (`REQUESTED`) dan selesai (`COMPLETED`).
    *   **Click-Through Rate (CTR)**: Rasio klik pada carousel rekomendasi dibanding total tayangan (*impressions*).
2.  **Tracking Property**:
    *   Setiap request transaksi yang dipicu dari layar rekomendasi membawa atribut metadata `source: "recommendation"` pada analitik event `transaction_requested`.
3.  **Kriteria Peningkatan ke LLM**:
    *   Jika volume transaksi berbasis rekomendasi telah stabil dan pengguna meminta fitur rekomendasi berbasis "kemiripan alur cerita / gaya penulisan", baru lakukan migrasi ke *Vector Embeddings* (misal: pgvector + OpenAI/BGE embeddings).
