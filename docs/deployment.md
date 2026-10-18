# Panduan Deployment Produksi (Low-Cost / Free-Tier Friendly)

Dokumen ini berisi panduan langkah demi langkah untuk melakukan deployment platform **Tukar & Pinjam** ke lingkungan produksi dengan biaya serendah mungkin (memanfaatkan *free tier* dan opsi *low-cost* untuk tahap awal).

---

## 1. Rekomendasi Arsitektur & Perkiraan Biaya Bulanan

| Komponen | Pilihan Low-Cost / Free Tier | Perkiraan Biaya (USD / Bulan) |
| :--- | :--- | :--- |
| **Backend API (NestJS)** | **Render.com** (Web Service Free/Hobby) atau **Railway** | $0 - $7 |
| **Database (PostgreSQL)** | **Supabase** (Free Tier) atau **Neon.tech** | $0 |
| **Cache (Redis)** | **Upstash** (Free Tier - 10k req/day) | $0 |
| **Storage (S3 Compatible)** | **Cloudflare R2** (Free Tier: 10GB gratis) | $0 |
| **Frontend Web (Next.js)** | **Vercel** (Hobby / Free Tier) | $0 |
| **Mobile App Build** | **Expo EAS Build** (Free Tier: 30 build/bulan) | $0 |
| **Domain & SSL** | Namecheap / Cloudflare Registrar + Free SSL | ~$10 - $12 / tahun (~$1/bulan) |
| **Total Estimasi** | | **$1 - $8 / bulan** |

---

## 2. Langkah-Langkah Deployment

### A. Database (Supabase / Neon)
1. Buat project baru di **Supabase** atau **Neon**.
2. Salin *Connection String* (Pooler / Direct URL).
3. Jalankan migrasi Prisma dari mesin lokal Anda ke database produksi:
   ```bash
   export DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   pnpm --filter @app/db push
   ```

### B. Redis (Upstash)
1. Buat database Redis baru di **Upstash**.
2. Salin *Redis URL* (`rediss://default:...`).

### C. Backend API (Render.com / Railway)
1. Hubungkan repository GitHub Anda ke **Render** atau **Railway**.
2. Set **Root Directory**: `apps/api`.
3. Set **Build Command**: `pnpm install && pnpm build` (atau sesuaikan dengan monorepo build).
4. Masukkan *Environment Variables* di dashboard:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `JWT_SECRET`
   - `MINIO_ENDPOINT` / Cloudflare R2 Keys.

### D. Frontend Web (Vercel)
1. Import repository ke **Vercel**.
2. Set **Root Directory**: `apps/web`.
3. Tambahkan environment variables untuk API endpoint produksi (`NEXT_PUBLIC_API_URL`).

### E. Mobile App (Expo EAS)
1. Install EAS CLI: `npm install -g eas-cli`
2. Login ke Expo: `eas login`
3. Konfigurasi `eas.json` untuk build Android (APK/AAB):
   ```json
   {
     "cli": { "version": ">= 5.0.0" },
     "build": {
       "development": { "developmentClient": true, "distribution": "internal" },
       "preview": { "distribution": "internal" },
       "production": {
         "android": { "buildType": "app-bundle" }
       }
     },
     "submit": { "production": {} }
   }
   ```
4. Jalankan build Android pertama:
   ```bash
   eas build --platform android --profile production
   ```

---

## 3. Strategi Backup Database & Migrasi Aman
- **Backup Otomatis**: Supabase/Neon menyediakan *daily automated backups* pada dashboard mereka.
- **Migrasi Aman**: Gunakan `prisma migrate deploy` di dalam skrip startup atau *CI/CD pipeline* sebelum server NestJS mulai mendengarkan port, guna menghindari *schema drift*.
