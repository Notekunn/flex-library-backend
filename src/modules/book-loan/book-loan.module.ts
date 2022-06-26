import { BookCopyEntity } from '@modules/book/entities/book-copy.entity';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoandCommandHandlers } from './commands';
import { BookLoanEntity } from './entities/book-loan.entity';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([BookLoanEntity, BookCopyEntity]), CqrsModule],
  providers: [...BookLoandCommandHandlers],
})
export class BookLoanModule {}
