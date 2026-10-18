import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new book club' })
  create(@Request() req, @Body() body: any) {
    return this.clubsService.createClub(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/join')
  @ApiOperation({ summary: 'Join a book club' })
  join(@Request() req, @Param('id') id: string) {
    return this.clubsService.joinClub(req.user.id, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get club details including members and discussions' })
  getDetails(@Param('id') id: string) {
    return this.clubsService.getClubDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/discussions')
  @ApiOperation({ summary: 'Add discussion in club' })
  addDiscussion(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.clubsService.addDiscussion(req.user.id, id, body);
  }
}
