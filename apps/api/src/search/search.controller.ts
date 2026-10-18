import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchBooksQuery, SearchBooksQuerySchema } from '@app/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('books')
  @ApiOperation({ summary: 'Search and filter books' })
  searchBooks(@Query() query: SearchBooksQuery) {
    // Validation handled by NestJS pipe if configured, but we can do it here too
    return this.searchService.searchBooks(query);
  }
}
