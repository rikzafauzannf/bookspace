import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RequestBorrowInput, RequestTradeInput, HandoverInput, ReturnInput } from '@app/common';
import { TransactionStatus, TransactionType, BookStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async requestBorrow(userId: string, dto: RequestBorrowInput) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Check user new user loan limits (max 1 active loan for unverified / new users)
      const activeLoans = await tx.transaction.count({
        where: {
          initiatorId: userId,
          type: TransactionType.BORROW,
          status: { in: [TransactionStatus.REQUESTED, TransactionStatus.APPROVED, TransactionStatus.HANDED_OVER, TransactionStatus.OVERDUE] },
        },
      });

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user?.isVerified && activeLoans >= 1) {
        throw new BadRequestException('Unverified new users can only have 1 active loan at a time');
      } else if (activeLoans >= 2) {
        throw new BadRequestException('Maximum active loans reached (limit: 2)');
      }

      // 2. Check book availability
      const book = await tx.book.findUnique({ where: { id: dto.bookId } });
      if (!book) throw new NotFoundException('Book not found');
      if (!book.allowRent) throw new BadRequestException('This book is not available for rent');
      if (book.status !== BookStatus.AVAILABLE_FOR_RENT) {
        throw new BadRequestException('Book is currently not available');
      }
      if (book.ownerId === userId) {
        throw new BadRequestException('You cannot borrow your own book');
      }

      // 3. Create Transaction
      return tx.transaction.create({
        data: {
          type: TransactionType.BORROW,
          status: TransactionStatus.REQUESTED,
          bookId: dto.bookId,
          initiatorId: userId,
          ownerId: book.ownerId,
          durationDays: dto.durationDays,
          depositAmount: dto.depositAmount || book.depositAmount,
          history: {
            create: {
              fromStatus: TransactionStatus.REQUESTED,
              toStatus: TransactionStatus.REQUESTED,
              actorId: userId,
              notes: 'Borrow request created',
            },
          },
        },
        include: { history: true },
      });
    });
  }

  async requestTrade(userId: string, dto: RequestTradeInput) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: dto.bookId } });
      if (!book) throw new NotFoundException('Target book not found');
      if (book.status !== BookStatus.OPEN_TRADE) throw new BadRequestException('Book is not open for trade');
      if (book.ownerId === userId) throw new BadRequestException('You cannot trade with your own book');

      const offeredBook = await tx.book.findUnique({ where: { id: dto.offeredBookId } });
      if (!offeredBook) throw new NotFoundException('Offered book not found');
      if (offeredBook.ownerId !== userId) throw new ForbiddenException('You do not own the offered book');

      return tx.transaction.create({
        data: {
          type: TransactionType.TRADE,
          status: TransactionStatus.REQUESTED,
          bookId: dto.bookId,
          offeredBookId: dto.offeredBookId,
          initiatorId: userId,
          ownerId: book.ownerId,
          history: {
            create: {
              fromStatus: TransactionStatus.REQUESTED,
              toStatus: TransactionStatus.REQUESTED,
              actorId: userId,
              notes: 'Trade request created',
            },
          },
        },
        include: { history: true },
      });
    });
  }

  async updateStatus(userId: string, transactionId: string, targetStatus: TransactionStatus, notes?: string, images?: string[]) {
    const trx = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!trx) throw new NotFoundException('Transaction not found');

    // Authorization: Only initiator or owner can modify
    if (trx.initiatorId !== userId && trx.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // State machine verification
    this.validateTransition(trx.status, targetStatus, userId === trx.ownerId ? 'OWNER' : 'INITIATOR');

    const updateData: any = { status: targetStatus };

    if (targetStatus === TransactionStatus.APPROVED) {
      if (userId !== trx.ownerId) throw new ForbiddenException('Only the owner can approve requests');
    }

    if (targetStatus === TransactionStatus.REJECTED || targetStatus === TransactionStatus.CANCELLED) {
      updateData.completedAt = new Date();
    }

    if (targetStatus === TransactionStatus.HANDED_OVER) {
      if (!images || images.length === 0) throw new BadRequestException('Condition photos are required for handover');
      updateData.handedOverAt = new Date();
      updateData.handoverImages = images;
      updateData.handoverNotes = notes;

      // Calculate due date for borrow
      if (trx.type === TransactionType.BORROW && trx.durationDays) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + trx.durationDays);
        updateData.dueDate = dueDate;
      }
    }

    if (targetStatus === TransactionStatus.RETURNED) {
      if (!images || images.length === 0) throw new BadRequestException('Condition photos are required for return');
      updateData.returnedAt = new Date();
      updateData.returnImages = images;
      updateData.returnNotes = notes;
    }

    if (targetStatus === TransactionStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    // Perform transaction update, book status update, and history insertion atomically
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id: transactionId },
        data: updateData,
      });

      // Synchronize Book status based on transaction progression
      if (targetStatus === TransactionStatus.HANDED_OVER) {
        const newBookStatus = trx.type === TransactionType.BORROW ? BookStatus.RENTED : BookStatus.TRADED;
        await tx.book.update({
          where: { id: trx.bookId },
          data: { status: newBookStatus },
        });

        if (trx.offeredBookId) {
          await tx.book.update({
            where: { id: trx.offeredBookId },
            data: { status: BookStatus.TRADED },
          });
        }
      } else if (targetStatus === TransactionStatus.COMPLETED || targetStatus === TransactionStatus.CANCELLED || targetStatus === TransactionStatus.REJECTED) {
        if (trx.type === TransactionType.BORROW) {
          await tx.book.update({
            where: { id: trx.bookId },
            data: { status: BookStatus.AVAILABLE_FOR_RENT },
          });
        }
      }

      await tx.transactionHistory.create({
        data: {
          transactionId,
          fromStatus: trx.status,
          toStatus: targetStatus,
          actorId: userId,
          notes,
        },
      });

      return updated;
    });
  }

  private validateTransition(current: TransactionStatus, target: TransactionStatus, role: 'OWNER' | 'INITIATOR') {
    const validMap: Record<TransactionStatus, TransactionStatus[]> = {
      REQUESTED: [TransactionStatus.APPROVED, TransactionStatus.REJECTED, TransactionStatus.CANCELLED],
      APPROVED: [TransactionStatus.HANDED_OVER, TransactionStatus.CANCELLED],
      HANDED_OVER: [TransactionStatus.RETURNED, TransactionStatus.OVERDUE, TransactionStatus.DISPUTED],
      OVERDUE: [TransactionStatus.RETURNED, TransactionStatus.DISPUTED],
      RETURNED: [TransactionStatus.COMPLETED, TransactionStatus.DISPUTED],
      REJECTED: [],
      CANCELLED: [],
      DISPUTED: [TransactionStatus.COMPLETED],
      COMPLETED: [],
    };

    if (!validMap[current]?.includes(target)) {
      throw new BadRequestException(`Invalid state transition from ${current} to ${target}`);
    }
  }

  async findByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ initiatorId: userId }, { ownerId: userId }],
      },
      include: {
        book: true,
        initiator: { select: { id: true, fullName: true, avatarUrl: true } },
        owner: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
