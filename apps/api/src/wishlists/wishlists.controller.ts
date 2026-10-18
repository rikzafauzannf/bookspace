import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlists.service';
import { CreateWishlistInput } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Add a book to wishlist' })
  add(@Request() req, @Body() body: CreateWishlistInput) {
    return this.wishlistService.add(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  getMyWishlist(@Request() req) {
    return this.wishlistService.getMyWishlist(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  remove(@Request() req, @Param('id') id: string) {
    return this.wishlistService.remove(req.user.id, id);
  }
}
