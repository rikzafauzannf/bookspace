import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Community (Challenges & Lists)')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('challenges')
  @ApiOperation({ summary: 'Set yearly reading challenge' })
  setChallenge(@Request() req, @Body() body: { targetCount: number; year: number }) {
    return this.communityService.setReadingChallenge(req.user.id, body.targetCount, body.year);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('reading-lists')
  @ApiOperation({ summary: 'Create a new reading list' })
  createReadingList(@Request() req, @Body() body: any) {
    return this.communityService.createReadingList(req.user.id, body);
  }

  @Get('reading-lists')
  @ApiOperation({ summary: 'Get public reading lists' })
  getReadingLists() {
    return this.communityService.getPublicReadingLists();
  }
}
