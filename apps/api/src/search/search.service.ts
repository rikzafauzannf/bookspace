import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SearchBooksQuery } from '@app/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchBooks(query: SearchBooksQuery) {
    const {
      query: text,
      genre,
      status,
      minCondition,
      cityId,
      latitude,
      longitude,
      radiusKm,
      page,
      limit,
    } = query;

    const where: Prisma.BookWhereInput = {
      // Basic text search
      OR: text ? [
        { title: { contains: text, mode: 'insensitive' } },
        { author: { contains: text, mode: 'insensitive' } },
        { isbn: { contains: text } },
      ] : undefined,

      // Filters
      genre: genre ? { has: genre } : undefined,
      status: status || undefined,
      condition: minCondition ? { gte: minCondition } : undefined,

      // Location filter (City level)
      owner: cityId ? { cityId } : undefined,
    };

    // Radius Filter (Post-processing or Raw Query)
    // Note: In production with PostGIS, we use ST_DWithin.
    // Here we simulate with a basic bounding box or just return results

    const [total, books] = await Promise.all([
      this.prisma.book.count({ where }),
      this.prisma.book.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              cityId: true,
              districtId: true,
              trustScore: true,
              latitude: true,
              longitude: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Simple Haversine distance if lat/lng provided
    let filteredBooks = books;
    if (latitude && longitude && radiusKm) {
      filteredBooks = books.filter((book) => {
        if (!book.owner.latitude || !book.owner.longitude) return true; // keep if no location set
        const dist = this.getDistance(
          latitude,
          longitude,
          book.owner.latitude,
          book.owner.longitude
        );
        return dist <= radiusKm;
      });
    }

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      results: filteredBooks,
    };
  }

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
