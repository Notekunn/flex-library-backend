import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './controllers/book.controller';
import { BookCommandHandlers } from './commands';
import { BookQueryHandlers } from './queries';
import { BookEntity } from './entities/book.entity';
import { StoreBookController } from './controllers/store-book.controller';
import { BookAdminController } from './controllers/book-admin.controller';

@Module({
  controllers: [BookAdminController, BookController, StoreBookController],
  providers: [...BookCommandHandlers, ...BookQueryHandlers],
  imports: [TypeOrmModule.forFeature([BookEntity]), CqrsModule],
})
export class BookModule {}
