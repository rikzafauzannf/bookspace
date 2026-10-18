import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookInput, UpdateBookInput } from '@app/common';
import { WishlistService } from '../wishlists/wishlists.service';
import https from 'https';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private wishlistService: WishlistService,
  ) {}

  async create(userId: string, data: CreateBookInput) {
    const book = await this.prisma.book.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });

    // Trigger wishlist match check in background
    this.wishlistService.checkWishlistMatches(book).catch(() => {});

    return book;
  }

  async findMyBooks(userId: string) {
    return this.prisma.book.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            trustScore: true,
            cityId: true,
            districtId: true,
          },
        },
      },
    });

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(userId: string, id: string, data: UpdateBookInput) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    if (book.ownerId !== userId) throw new ForbiddenException('You do not own this book');

    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    if (book.ownerId !== userId) throw new ForbiddenException('You do not own this book');

    return this.prisma.book.delete({ where: { id } });
  }

  async lookupIsbn(isbn: string): Promise<any> {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    try {
      const googleData = await this.fetchJson(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
      if (googleData?.items?.length > 0) {
        const info = googleData.items[0].volumeInfo;
        return {
          isbn: cleanIsbn,
          title: info.title,
          author: info.authors ? info.authors.join(', ') : 'Unknown',
          publisher: info.publisher || null,
          publishedYear: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4), 10) : null,
          description: info.description || null,
          language: info.language || 'id',
          genre: info.categories || [],
          images: info.imageLinks?.thumbnail ? [info.imageLinks.thumbnail.replace('http://', 'https://')] : [],
        };
      }
    } catch (err) {}

    return null;
  }

  private fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(null);
          }
        });
      }).on('error', (err) => reject(err));
    });
  }
}
