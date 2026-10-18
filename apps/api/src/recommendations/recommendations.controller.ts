import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Recommendations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('books')
  @ApiOperation({ summary: 'Get personalized book recommendations' })
  getRecommendedBooks(@Request() req, @Query('limit') limit?: number) {
    return this.recommendationsService.getRecommendedBooks(req.user.id, limit ? Number(limit) : 10);
  }

  @Get('readers')
  @ApiOperation({ summary: 'Get recommended readers in nearby area' })
  getRecommendedReaders(@Request() req, @Query('limit') limit?: number) {
    return this.recommendationsService.getRecommendedReaders(req.user.id, limit ? Number(limit) : 5);
  }
}
