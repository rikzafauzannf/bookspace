import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostInput, CreateCommentInput } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Social Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  create(@Request() req, @Body() body: CreatePostInput) {
    return this.postsService.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('feed')
  @ApiOperation({ summary: 'Get social feed' })
  getFeed(@Request() req, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.postsService.getFeed(req.user.id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/like')
  @ApiOperation({ summary: 'Toggle like on a post' })
  toggleLike(@Request() req, @Param('id') id: string) {
    return this.postsService.toggleLike(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  addComment(@Request() req, @Param('id') id: string, @Body() body: CreateCommentInput) {
    return this.postsService.addComment(req.user.id, id, body);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  getComments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  remove(@Request() req, @Param('id') id: string) {
    return this.postsService.remove(req.user.id, id);
  }
}
