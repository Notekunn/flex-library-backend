import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './controllers/book.controller';
import { BookCommandHandlers, BookCopyCommandHanders } from './commands';
import { BookCopyQueryHandlers, BookQueryHandlers } from './queries';
import { BookEntity } from './entities/book.entity';
import { StoreBookController } from './controllers/store-book.controller';
import { BookCopyController } from './controllers/book-copy.controller';
import { BookCopyEntity } from './entities/book-copy.entity';

@Module({
  controllers: [BookController, StoreBookController, BookCopyController],
  providers: [...BookCommandHandlers, ...BookQueryHandlers, ...BookCopyCommandHanders, ...BookCopyQueryHandlers],
  imports: [TypeOrmModule.forFeature([BookEntity, BookCopyEntity]), CqrsModule],
})
export class BookModule {}
