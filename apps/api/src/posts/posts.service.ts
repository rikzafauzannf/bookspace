import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostInput, CreateCommentInput } from '@app/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreatePostInput) {
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

  async getFeed(userId: string, page = 1, limit = 20) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    return this.prisma.post.findMany({
      where: {
        OR: [
          { userId: { in: followingIds } },
          { userId },
          { rating: { gte: 4 } },
        ],
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
        book: true,
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await this.prisma.postLike.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({ data: { postId, userId } });
      return { liked: true };
    }
  }

  async addComment(userId: string, postId: string, data: CreateCommentInput) {
    const sanitizedContent = sanitizeHtml(data.content);
    return this.prisma.postComment.create({
      data: {
        postId,
        userId,
        content: sanitizedContent,
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
  }

  async getComments(postId: string) {
    return this.prisma.postComment.findMany({
      where: { postId },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async remove(userId: string, id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.post.delete({ where: { id } });
  }
}
