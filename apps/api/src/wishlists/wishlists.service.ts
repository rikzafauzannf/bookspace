import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWishlistInput } from '@app/common';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, data: CreateWishlistInput) {
    return this.prisma.wishlist.create({
      data: { userId, ...data },
    });
  }

  async getMyWishlist(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, id: string) {
    return this.prisma.wishlist.deleteMany({
      where: { id, userId },
    });
  }

  async checkWishlistMatches(newBook: any) {
    const matches = await this.prisma.wishlist.findMany({
      where: {
        OR: [
          newBook.isbn ? { isbn: newBook.isbn } : {},
          { title: { contains: newBook.title, mode: 'insensitive' } },
        ],
      },
    });

    for (const match of matches) {
      if (match.userId === newBook.ownerId) continue; // Don't notify self

      await this.prisma.notification.create({
        data: {
          userId: match.userId,
          type: 'WISHLIST_MATCH',
          title: 'Buku Wishlist Tersedia!',
          message: `Buku "${newBook.title}" yang ada di wishlist kamu baru saja ditambahkan oleh pengguna lain!`,
          data: { bookId: newBook.id },
        },
      });
    }
  }
}
