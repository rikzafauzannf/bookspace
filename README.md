# Tukar & Pinjam Platform (Monorepo)

Platform komunitas pembaca untuk tukar dan pinjam buku fisik antar pengguna dengan fitur sosial, reputasi (Trust Score), dan privasi wilayah.

## Tech Stack
- **Monorepo**: Turborepo, pnpm
- **Backend**: NestJS, PostgreSQL, Prisma ORM, Redis (BullMQ), Socket.io
- **Web**: Next.js 14+ (App Router), Tailwind CSS
- **Mobile**: React Native, Expo Router
- **Shared Packages**: `@app/common` (Zod validation & shared types), `@app/db` (Prisma schema)

---

## Panduan Menjalankan dari Nol

### 1. Prasyarat
- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)
- Docker & Docker Compose

### 2. Instalasi Dependensi
```bash
git clone <repo-url>
cd post-pro
pnpm install
```

### 3. Menjalankan Docker Services (Database, Redis, MinIO)
```bash
docker compose up -d
```
Layanan berikut akan aktif:
- PostgreSQL di `localhost:5432`
- Redis di `localhost:6379`
- MinIO (S3 compatible) di `localhost:9000` (Console: `localhost:9001`)

### 4. Setup Environment & Migrasi Database
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Generate Prisma Client dan sinkronisasi skema ke database:
```bash
pnpm db:generate
pnpm db:push
```

### 5. Menjalankan Aplikasi dalam Mode Development
Untuk menjalankan backend API:
```bash
pnpm --filter @app/api dev
```
Atau menjalankan seluruh pipeline monorepo:
```bash
pnpm dev
```

### 6. Dokumentasi API
Buka browser dan akses Swagger UI di:
```
http://localhost:3000/docs
```

### 7. Menjalankan Test
```bash
pnpm test
```
