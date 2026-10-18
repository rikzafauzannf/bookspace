import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';

describe('ReviewsService & Trust Score Calculation', () => {
  let service: ReviewsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      transaction: {
        findUnique: jest.fn(),
        count: jest.fn(),
      },
      review: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  describe('Submit Review Constraints', () => {
    it('should reject review if transaction is still REQUESTED or APPROVED', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'trx-1',
        status: TransactionStatus.APPROVED,
        initiatorId: 'user-1',
        ownerId: 'user-2',
      });

      await expect(
        service.submitReview('user-1', {
          transactionId: 'trx-1',
          rating: 5,
          comment: 'Buku bagus',
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject review from an outsider not involved in the transaction', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'trx-1',
        status: TransactionStatus.COMPLETED,
        initiatorId: 'user-1',
        ownerId: 'user-2',
      });

      await expect(
        service.submitReview('user-intruder', {
          transactionId: 'trx-1',
          rating: 5,
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Trust Score Algorithm', () => {
    it('should calculate base score + rating bonus + transaction bonus correctly', async () => {
      // 2 ulasan: rating 5 dan rating 5 (rata-rata 5 -> bonus (5 - 3) * 10 = +20)
      prisma.review.findMany.mockResolvedValue([{ rating: 5 }, { rating: 5 }]);
      // 3 transaksi sukses (+2 * 3 = +6)
      prisma.transaction.count.mockResolvedValueOnce(3);
      // 0 overdue (-15 * 0 = 0)
      prisma.transaction.count.mockResolvedValueOnce(0);

      // Formula: 50 (base) + 20 (rating) + 6 (trx) - 0 (overdue) = 76
      await service.recalculateTrustScore('user-target');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-target' },
        data: { trustScore: 76 },
      });
    });

    it('should heavily penalize overdue loans and clamp minimum score to 0', async () => {
      // 1 ulasan bintang 1: (1 - 3) * 10 = -20
      prisma.review.findMany.mockResolvedValue([{ rating: 1 }]);
      // 1 transaksi sukses: +2
      prisma.transaction.count.mockResolvedValueOnce(1);
      // 5 kali overdue: 5 * -15 = -75
      prisma.transaction.count.mockResolvedValueOnce(5);

      // Formula: 50 - 20 + 2 - 75 = -43 -> Clamped ke 0
      await service.recalculateTrustScore('user-bad');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-bad' },
        data: { trustScore: 0 },
      });
    });
  });
});
