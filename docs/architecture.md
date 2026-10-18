# Arsitektur Sistem TUKAR & PINJAM

## Gambaran Umum
Platform sirkulasi buku fisik dengan fokus pada *trust* dan keamanan privasi.

## Stack Teknologi
- **Monorepo**: Turborepo + pnpm.
- **Backend**: NestJS, PostgreSQL, Prisma, Redis (BullMQ).
- **Web**: Next.js (App Router).
- **Mobile**: React Native (Expo Router).

## Strategi Transaksi & Keamanan
- **State Machine**: Transisi status transaksi (`REQUESTED` -> `COMPLETED`) dikelola secara ketat.
- **Deposit**: Manual (via chat + bukti foto) untuk MVP.
- **OTP**: WhatsApp-based OTP.
- **Privasi**: Lokasi dibatasi pada tingkat Kecamatan.
- **Moderasi**: *Report-based* system di dashboard admin.

## Skema Database
- Model Utama: `User`, `Book`, `Transaction`, `Post`, `Report`, `Notification`.
