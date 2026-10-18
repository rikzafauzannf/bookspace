import { Controller, Get, Patch, Body, UseGuards, Request, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileInput } from '@app/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req, @Body() body: UpdateProfileInput) {
    return this.usersService.update(req.user.id, body);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Toggle follow user' })
  toggleFollow(@Request() req, @Param('id') id: string) {
    return this.usersService.toggleFollow(req.user.id, id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get user followers' })
  getFollowers(@Param('id') id: string) {
    return this.usersService.getFollowers(id);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get users being followed' })
  getFollowing(@Param('id') id: string) {
    return this.usersService.getFollowing(id);
  }
}
