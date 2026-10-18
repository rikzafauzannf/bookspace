import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { SubmitReviewInput } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Submit a review for a transaction' })
  submit(@Request() req, @Body() dto: SubmitReviewInput) {
    return this.reviewsService.submitReview(req.user.id, dto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all reviews received by a user' })
  getUserReviews(@Param('id') id: string) {
    return this.reviewsService.findByTargetUser(id);
  }
}
