import { BookLoanStatus } from '@constants/book-loan-status.enum';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookLoanEntity } from '../entities/book-loan.entity';
import { BookLoanRepository } from '../repositories/book-loan.repository';

export class GetAllBookLoanQuery extends Query<BookLoanEntity[]> {
  constructor(public readonly userId: number, public readonly status?: BookLoanStatus) {
    super();
  }
}

@QueryHandler(GetAllBookLoanQuery)
export class GetAllBookLoanQueryHandler implements IQueryHandler<GetAllBookLoanQuery, BookLoanEntity[]> {
  constructor(
    @InjectRepository(BookLoanEntity)
    private readonly bookLoanRepository: BookLoanRepository,
  ) {}
  async execute(query: GetAllBookLoanQuery): Promise<BookLoanEntity[]> {
    const { userId, status } = query;
    return this.bookLoanRepository.find({
      where: {
        order: {
          user: {
            id: userId,
          },
        },
        status: status || BookLoanStatus.RENTING,
      },
      relations: ['order', 'bookCopy'],
    });
  }
}
