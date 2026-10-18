import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransactionStatus, TransactionType, BookStatus } from '@prisma/client';

describe('TransactionsService (State Machine & Edge Cases)', () => {
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

  describe('Borrow Request Limits & Edge Cases', () => {
    it('should throw if unverified user exceeds max 1 active loan', async () => {
      prisma.transaction.count.mockResolvedValue(1);
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', isVerified: false });

      await expect(
        service.requestBorrow('u1', { bookId: 'b1', durationDays: 7 })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if user tries to borrow their own book', async () => {
      prisma.transaction.count.mockResolvedValue(0);
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', isVerified: true });
      prisma.book.findUnique.mockResolvedValue({
        id: 'b1',
        ownerId: 'u1',
        allowRent: true,
        status: BookStatus.AVAILABLE_FOR_RENT,
      });

      await expect(
        service.requestBorrow('u1', { bookId: 'b1', durationDays: 7 })
      ).rejects.toThrow('You cannot borrow your own book');
    });

    it('should throw if book is not available for rent', async () => {
      prisma.transaction.count.mockResolvedValue(0);
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', isVerified: true });
      prisma.book.findUnique.mockResolvedValue({
        id: 'b1',
        ownerId: 'u2',
        allowRent: false,
        status: BookStatus.COLLECTION,
      });

      await expect(
        service.requestBorrow('u1', { bookId: 'b1', durationDays: 7 })
      ).rejects.toThrow('This book is not available for rent');
    });
  });

  describe('State Machine Transitions', () => {
    it('should allow valid transition from REQUESTED to APPROVED by Owner', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 't1',
        status: TransactionStatus.REQUESTED,
        initiatorId: 'u1',
        ownerId: 'u2',
        bookId: 'b1',
      });

      await service.updateStatus('u2', 't1', TransactionStatus.APPROVED);
      expect(prisma.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: TransactionStatus.APPROVED }),
        })
      );
    });

    it('should throw if non-owner tries to approve request', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 't1',
        status: TransactionStatus.REQUESTED,
        initiatorId: 'u1',
        ownerId: 'u2',
        bookId: 'b1',
      });

      await expect(
        service.updateStatus('u1', 't1', TransactionStatus.APPROVED)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject invalid state jump (e.g., REQUESTED directly to RETURNED)', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 't1',
        status: TransactionStatus.REQUESTED,
        initiatorId: 'u1',
        ownerId: 'u2',
        bookId: 'b1',
      });

      await expect(
        service.updateStatus('u2', 't1', TransactionStatus.RETURNED, 'notes', ['img1.jpg'])
      ).rejects.toThrow('Invalid state transition from REQUESTED to RETURNED');
    });

    it('should enforce condition photos on Handover and sync Book status to RENTED', async () => {
      prisma.transaction.findUnique.mockResolvedValue({
        id: 't1',
        status: TransactionStatus.APPROVED,
        initiatorId: 'u1',
        ownerId: 'u2',
        bookId: 'b1',
        type: TransactionType.BORROW,
        durationDays: 7,
      });

      await service.updateStatus('u2', 't1', TransactionStatus.HANDED_OVER, 'notes', ['photo.jpg']);

      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 'b1' },
        data: { status: BookStatus.RENTED },
      });
    });
  });
});
