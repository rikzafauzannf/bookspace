# TukarBuku Platform

Platform pertukaran dan peminjaman buku komunitas yang mengedepankan kepercayaan dan kemudahan akses.

## Teknologi
- **Framework**: Next.js 16 (App Router) & NestJS (API)
- **Database**: PostgreSQL (Prisma ORM)
- **Caching**: Redis
- **Storage**: MinIO (S3 Compatible)
- **Real-time**: Socket.io (WebSocket Service)
- **Styling**: Tailwind CSS 4 & shadcn/ui

## Struktur Folder
- `apps/web`: Frontend Next.js
- `apps/api`: Backend NestJS
- `mini-services/websocket-service`: Layanan real-time
- `packages/`: Shared logic & UI components
- `docker-compose.yml`: Orkestrasi container

## Cara Menjalankan
Pastikan Docker terinstal, lalu jalankan di root folder:

```bash
docker-compose up --build
```

Aplikasi akan tersedia di:
- Web: http://localhost:3000
- API: http://localhost:3001
- WebSocket: http://localhost:3003
