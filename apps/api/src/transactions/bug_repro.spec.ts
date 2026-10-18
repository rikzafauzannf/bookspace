import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';
import { TransactionStatus, BookStatus } from '@prisma/client';

describe('Bug Reproduction: Book Status Sync', () => {
  let service: TransactionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      transaction: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      book: {
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

  it('SHOULD update book status to RENTED when transaction is HANDED_OVER', async () => {
    prisma.transaction.findUnique.mockResolvedValue({
      id: 'trx1',
      status: TransactionStatus.APPROVED,
      initiatorId: 'u1',
      ownerId: 'u2',
      bookId: 'b1',
      type: 'BORROW',
    });

    await service.updateStatus('u2', 'trx1', TransactionStatus.HANDED_OVER, 'notes', ['img.jpg']);

    // Ini akan GAGAL pada kode saat ini karena kita belum memanggil tx.book.update
    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { id: 'b1' },
      data: { status: BookStatus.RENTED },
    });
  });
});
