import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async getRecommendedBooks(userId: string, limit = 10) {
    // 1. Get user profile, wishlists, and genres from user's own collection
    const [user, wishlists, myBooks] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.wishlist.findMany({ where: { userId } }),
      this.prisma.book.findMany({ where: { ownerId: userId }, select: { genre: true } }),
    ]);

    const userGenres = Array.from(new Set(myBooks.flatMap((b) => b.genre)));
    const wishlistIsbns = wishlists.map((w) => w.isbn).filter(Boolean) as string[];
    const wishlistTitles = wishlists.map((w) => w.title);

    // 2. Query books matching location, wishlist, or genres
    const books = await this.prisma.book.findMany({
      where: {
        ownerId: { not: userId },
        status: { in: ['AVAILABLE_FOR_RENT', 'OPEN_TRADE'] },
        OR: [
          // Wishlist matches
          { isbn: { in: wishlistIsbns } },
          ...wishlistTitles.map((t) => ({ title: { contains: t, mode: 'insensitive' as const } })),
          // Genre matches
          { genre: { hasSome: userGenres } },
          // Nearby city match
          user?.cityId ? { owner: { cityId: user.cityId } } : {},
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            cityId: true,
            districtId: true,
            trustScore: true,
            // Masking precise coordinates or exact addresses for privacy
          },
        },
      },
      take: limit * 2,
    });

    // 3. Simple Scoring Algorithm (Content-based + Distance/Trust weight)
    const scoredBooks = books.map((book) => {
      let score = 0;

      // Match Wishlist (+50)
      if (book.isbn && wishlistIsbns.includes(book.isbn)) score += 50;
      if (wishlistTitles.some((t) => book.title.toLowerCase().includes(t.toLowerCase()))) score += 30;

      // Match Genre (+10 per matching genre)
      const matchingGenres = book.genre.filter((g) => userGenres.includes(g));
      score += matchingGenres.length * 10;

      // Same City (+15)
      if (user?.cityId && book.owner.cityId === user.cityId) score += 15;

      // Trust Score Weight (+ trustScore / 10)
      score += (book.owner.trustScore || 0) / 10;

      return { book, score };
    });

    // Sort by score descending and return
    scoredBooks.sort((a, b) => b.score - a.score);
    return scoredBooks.slice(0, limit).map((sb) => ({
      ...sb.book,
      recommendationScore: sb.score,
    }));
  }

  async getRecommendedReaders(userId: string, limit = 5) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    // Find active readers in the same city or district with high trust score
    const readers = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        isActive: true,
        cityId: user.cityId || undefined,
      },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        trustScore: true,
        cityId: true,
        districtId: true,
        _count: { select: { books: true, reviewsReceived: true } },
      },
      orderBy: [{ trustScore: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    return readers;
  }
}
