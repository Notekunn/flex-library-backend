import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookCommandHandlers } from './commands';
import { BookEntity } from './entities/book.entity';
import { BookQueryHandlers } from './queries';

@Module({
  controllers: [BookController],
  providers: [...BookCommandHandlers, ...BookQueryHandlers],
  imports: [TypeOrmModule.forFeature([BookEntity]), CqrsModule],
})
export class BookModule {}
