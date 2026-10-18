import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ChatModule } from './chat/chat.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PostsModule } from './posts/posts.module';
import { SearchModule } from './search/search.module';
import { WishlistModule } from './wishlists/wishlists.module';
import { AdminModule } from './admin/admin.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    AuthModule,
    UsersModule,
    BooksModule,
    TransactionsModule,
    ChatModule,
    ReviewsModule,
    PostsModule,
    SearchModule,
    WishlistModule,
    AdminModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
