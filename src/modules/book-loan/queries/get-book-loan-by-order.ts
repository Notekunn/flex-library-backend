import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoanEntity } from '../entities/book-loan.entity';
import { BookLoanRepository } from '../repositories/book-loan.repository';

export class GetBookLoanByOrderQuery extends Query<BookLoanEntity[]> {
  constructor(public readonly orderId: number) {
    super();
  }
}

@QueryHandler(GetBookLoanByOrderQuery)
export class GetBookLoanByOrderQueryHandler implements IQueryHandler<GetBookLoanByOrderQuery, BookLoanEntity[]> {
  constructor(
    @InjectRepository(BookLoanEntity)
    private readonly bookLoanRepository: BookLoanRepository,
  ) {}
  execute(query: GetBookLoanByOrderQuery) {
    return this.bookLoanRepository.find({
      where: {
        order: {
          id: query.orderId,
        },
      },
      relations: ['order', 'bookCopy'],
    });
  }
}
