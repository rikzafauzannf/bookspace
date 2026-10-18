import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsTaskService {
  private readonly logger = new Logger(TransactionsTaskService.name);

  constructor(private prisma: PrismaService) {}

  // Intended to be invoked via BullMQ / NestJS Cron every hour
  async checkOverdueLoans() {
    this.logger.log('Checking for overdue transactions...');
    const now = new Date();

    const overdueTrxs = await this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.HANDED_OVER,
        dueDate: { lt: now },
      },
    });

    for (const trx of overdueTrxs) {
      await this.prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { id: trx.id },
          data: { status: TransactionStatus.OVERDUE },
        });

        await tx.transactionHistory.create({
          data: {
            transactionId: trx.id,
            fromStatus: TransactionStatus.HANDED_OVER,
            toStatus: TransactionStatus.OVERDUE,
            actorId: 'SYSTEM',
            notes: 'Marked as overdue automatically by scheduler',
          },
        });
      });

      this.logger.warn(`Transaction ${trx.id} marked as OVERDUE`);
      // Trigger push notification / email reminder logic here
    }
  }
}
