import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubmitReviewInput } from '@app/common';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async submitReview(reviewerId: string, dto: SubmitReviewInput) {
    const trx = await this.prisma.transaction.findUnique({
      where: { id: dto.transactionId },
    });

    if (!trx) throw new NotFoundException('Transaction not found');
    if (trx.status !== 'COMPLETED' && trx.status !== 'RETURNED') {
      throw new BadRequestException('Review can only be submitted for returned or completed transactions');
    }

    if (trx.initiatorId !== reviewerId && trx.ownerId !== reviewerId) {
      throw new BadRequestException('Access denied');
    }

    const targetUserId = trx.initiatorId === reviewerId ? trx.ownerId : trx.initiatorId;

    const review = await this.prisma.review.create({
      data: {
        transactionId: dto.transactionId,
        reviewerId,
        targetUserId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    // Update target user trust score
    await this.recalculateTrustScore(targetUserId);

    return review;
  }

  async recalculateTrustScore(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { targetUserId: userId },
      select: { rating: true },
    });

    const totalTransactions = await this.prisma.transaction.count({
      where: {
        OR: [{ initiatorId: userId }, { ownerId: userId }],
        status: 'COMPLETED',
      },
    });

    const overdueCount = await this.prisma.transaction.count({
      where: {
        initiatorId: userId,
        history: { some: { toStatus: 'OVERDUE' } },
      },
    });

    // Simple Trust Score Formula (50 base + rating bonus - overdue penalty)
    let score = 50;

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      score += (avgRating - 3) * 10; // +20 for 5 star, -20 for 1 star
    }

    score += totalTransactions * 2; // +2 per successful transaction
    score -= overdueCount * 15;    // -15 per overdue incident

    // Clamp between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    await this.prisma.user.update({
      where: { id: userId },
      data: { trustScore: finalScore },
    });
  }

  async findByTargetUser(userId: string) {
    return this.prisma.review.findMany({
      where: { targetUserId: userId },
      include: {
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
