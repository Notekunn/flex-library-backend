import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BookLoandCommandHandlers } from './commands';

@Module({
  controllers: [],
  imports: [CqrsModule],
  providers: [...BookLoandCommandHandlers],
})
export class BookLoanModule {}
