import { Module } from '@nestjs/common';
import { WishlistService } from './wishlists.service';
import { WishlistController } from './wishlists.controller';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
