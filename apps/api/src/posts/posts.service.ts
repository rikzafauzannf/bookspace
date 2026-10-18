import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostInput, CreateCommentInput } from '@app/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreatePostInput) {
    // Sanitasi HTML untuk mencegah XSS
    const sanitizedContent = sanitizeHtml(data.content);

    return this.prisma.post.create({
      data: {
        userId,
        content: sanitizedContent,
        rating: data.rating,
        bookId: data.bookId,
        images: data.images,
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
        book: true,
      },
    });
  }

  // ... sisanya tidak berubah
}
