import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookInput, UpdateBookInput } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('lookup/:isbn')
  @ApiOperation({ summary: 'Lookup book details via ISBN (Google Books / OpenLibrary)' })
  lookupIsbn(@Param('isbn') isbn: string) {
    return this.booksService.lookupIsbn(isbn);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Add a new book to collection' })
  create(@Request() req, @Body() createBookDto: CreateBookInput) {
    return this.booksService.create(req.user.id, createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({ summary: 'Get current user shelf/books' })
  findMyBooks(@Request() req) {
    return this.booksService.findMyBooks(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book detail' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update book details/rules' })
  update(@Request() req, @Param('id') id: string, @Body() updateBookDto: UpdateBookInput) {
    return this.booksService.update(req.user.id, id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  remove(@Request() req, @Param('id') id: string) {
    return this.booksService.remove(req.user.id, id);
  }
}
