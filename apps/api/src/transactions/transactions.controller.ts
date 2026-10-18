import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { RequestBorrowInput, RequestTradeInput, HandoverInput, ReturnInput } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Request to borrow a book' })
  requestBorrow(@Request() req, @Body() dto: RequestBorrowInput) {
    return this.transactionsService.requestBorrow(req.user.id, dto);
  }

  @Post('trade')
  @ApiOperation({ summary: 'Request to trade a book' })
  requestTrade(@Request() req, @Body() dto: RequestTradeInput) {
    return this.transactionsService.requestTrade(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user transactions (as initiator or owner)' })
  findAll(@Request() req) {
    return this.transactionsService.findByUser(req.user.id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a transaction request' })
  approve(@Request() req, @Param('id') id: string) {
    return this.transactionsService.updateStatus(req.user.id, id, TransactionStatus.APPROVED);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a transaction request' })
  reject(@Request() req, @Param('id') id: string, @Body('notes') notes?: string) {
    return this.transactionsService.updateStatus(req.user.id, id, TransactionStatus.REJECTED, notes);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a transaction request' })
  cancel(@Request() req, @Param('id') id: string) {
    return this.transactionsService.updateStatus(req.user.id, id, TransactionStatus.CANCELLED);
  }

  @Patch(':id/handover')
  @ApiOperation({ summary: 'Confirm handover with condition photos' })
  handover(@Request() req, @Param('id') id: string, @Body() dto: HandoverInput) {
    return this.transactionsService.updateStatus(req.user.id, id, TransactionStatus.HANDED_OVER, dto.notes, dto.images);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Confirm return with condition photos' })
  returnBook(@Request() req, @Param('id') id: string, @Body() dto: ReturnInput) {
    return this.transactionsService.updateStatus(req.user.id, id, TransactionStatus.RETURNED, dto.notes, dto.images);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete transaction' })
  complete(@Request() req, @Param('id') id: string) {
    return this.transactionsService.updateStatus(req.user.id, id, TransactionStatus.COMPLETED);
  }
}
