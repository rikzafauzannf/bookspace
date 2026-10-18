import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TransactionStatus, TransactionType, BookStatus } from '@prisma/client';

describe('Comprehensive Transactions Test Suite', () => {
  let service: TransactionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      transaction: {
        count: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      book: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      transactionHistory: {
        create: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('1. State Machine: Valid & Invalid Transitions', () => {
    const validTransitions: [TransactionStatus, TransactionStatus][] = [
      [TransactionStatus.REQUESTED, TransactionStatus.APPROVED],
      [TransactionStatus.REQUESTED, TransactionStatus.REJECTED],
      [TransactionStatus.REQUESTED, TransactionStatus.CANCELLED],
      [TransactionStatus.APPROVED, TransactionStatus.HANDED_OVER],
      [TransactionStatus.APPROVED, TransactionStatus.CANCELLED],
      [TransactionStatus.HANDED_OVER, TransactionStatus.RETURNED],
      [TransactionStatus.HANDED_OVER, TransactionStatus.OVERDUE],
      [TransactionStatus.HANDED_OVER, TransactionStatus.DISPUTED],
      [TransactionStatus.OVERDUE, TransactionStatus.RETURNED],
      [TransactionStatus.OVERDUE, TransactionStatus.DISPUTED],
      [TransactionStatus.RETURNED, TransactionStatus.COMPLETED],
      [TransactionStatus.RETURNED, TransactionStatus.DISPUTED],
      [TransactionStatus.DISPUTED, TransactionStatus.COMPLETED],
    ];

    test.each(validTransitions)(
      'should allow transition from %s to %s',
      async (from, to) => {
        prisma.transaction.findUnique.mockResolvedValue({
          id: 'trx-1',
          status: from,
          initiatorId: 'user-initiator',
          ownerId: 'user-owner',
          bookId: 'book-1',
          type: TransactionType.BORROW,
          durationDays: 7,
        });

        const actorId = to === TransactionStatus.APPROVED || to === TransactionStatus.REJECTED
          ? 'user-owner'
          : 'user-initiator';

        const result = await service.updateStatus(
          actorId,
          'trx-1',
          to,
          'Test notes',
          ['https://example.com/photo.jpg']
        );

        expect(prisma.transaction.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ status: to }),
          })
        );
      }
    );

    const invalidTransitions: [TransactionStatus, TransactionStatus][] = [
      [TransactionStatus.REQUESTED, TransactionStatus.HANDED_OVER],
      [TransactionStatus.REQUESTED, TransactionStatus.COMPLETED],
      [TransactionStatus.REQUESTED, TransactionStatus.RETURNED],
      [TransactionStatus.APPROVED, TransactionStatus.COMPLETED],
      [TransactionStatus.COMPLETED, TransactionStatus.REQUESTED],
      [TransactionStatus.REJECTED, TransactionStatus.APPROVED],
      [TransactionStatus.CANCELLED, TransactionStatus.APPROVED],
    ];

    test.each(invalidTransitions)(
      'should reject invalid transition from %s to %s',
      async (from, to) => {
        prisma.transaction.findUnique.mockResolvedValue({
          id: 'trx-1',
          status: from,
          initiatorId: 'user-initiator',
          ownerId: 'user-owner',
          bookId: 'book-1',
        });

        await expect(
          service.updateStatus('user-owner', 'trx-1', to, 'Notes', ['https://example.com/p.jpg'])
        ).rejects.toThrow(BadRequestException);
      }
    );
  });

  describe('2. User Authorization (IDOR)', () => {
    it('should forbid third-party user from approving or modifying a transaction', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'trx-1',
        status: TransactionStatus.REQUESTED,
        initiatorId: 'user-1',
        ownerId: 'user-2',
        bookId: 'book-1',
      });

      await expect(
        service.updateStatus('user-intruder', 'trx-1', TransactionStatus.APPROVED)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should forbid initiator from approving their own request', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 'trx-1',
        status: TransactionStatus.REQUESTED,
        initiatorId: 'user-1',
        ownerId: 'user-2',
        bookId: 'book-1',
      });

      await expect(
        service.updateStatus('user-1', 'trx-1', TransactionStatus.APPROVED)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('3. New User Loan Limit', () => {
    it('should forbid unverified new users from borrowing if they already have 1 active loan', async () => {
      prisma.transaction.count.mockResolvedValue(1);
      prisma.user.findUnique.mockResolvedValue({ id: 'user-unverified', isVerified: false });
      prisma.book.findUnique.mockResolvedValue({
        id: 'book-1',
        status: BookStatus.AVAILABLE_FOR_RENT,
        allowRent: true,
        ownerId: 'user-owner',
      });

      await expect(
        service.requestBorrow('user-unverified', { bookId: 'book-1', durationDays: 14 })
      ).rejects.toThrow('Unverified new users can only have 1 active loan at a time');
    });

    it('should forbid any user from having more than 2 active loans simultaneously', async () => {
      prisma.transaction.count.mockResolvedValue(2);
      prisma.user.findUnique.mockResolvedValue({ id: 'user-verified', isVerified: true });
      prisma.book.findUnique.mockResolvedValue({
        id: 'book-1',
        status: BookStatus.AVAILABLE_FOR_RENT,
        allowRent: true,
        ownerId: 'user-owner',
      });

      await expect(
        service.requestBorrow('user-verified', { bookId: 'book-1', durationDays: 14 })
      ).rejects.toThrow('Maximum active loans reached (limit: 2)');
    });
  });
});
