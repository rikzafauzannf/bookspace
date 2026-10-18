import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsTaskService } from './transactions.task';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsTaskService],
  exports: [TransactionsService, TransactionsTaskService],
})
export class TransactionsModule {}
