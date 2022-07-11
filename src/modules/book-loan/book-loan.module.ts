import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoanController } from './controllers/book-loan.controller';
import { BookLoanAdminController } from './controllers/book-loan-admin.controller';
import { BookLoandCommandHandlers } from './commands';
import { BookLoanEntity } from './entities/book-loan.entity';
import { BookLoanQueryHandlers } from './queries';

@Module({
  controllers: [BookLoanController, BookLoanAdminController],
  imports: [TypeOrmModule.forFeature([BookLoanEntity]), CqrsModule],
  providers: [...BookLoandCommandHandlers, ...BookLoanQueryHandlers],
})
export class BookLoanModule {}
