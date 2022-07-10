import { BookStatus } from '@constants/book-status.enum';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookResponseDto } from '../dto/book-response.dto';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { GetBookRentCountQuery } from './get-book-rentcount.query';

export class GetOneBookQuery extends Query<BookEntity | null> {
  constructor(public readonly id: number) {
    super();
  }
}
@QueryHandler(GetOneBookQuery)
export class GetOneBookQueryHandler implements IQueryHandler<GetOneBookQuery, BookResponseDto | null> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(query: GetOneBookQuery) {
    const { id } = query;
    const builder = this.bookRepository.createQueryBuilder('book');
    builder
      .leftJoinAndSelect('book.store', 'store')
      .leftJoinAndSelect('book.categories', 'category')
      .loadRelationCountAndMap('book.numOfCopies', 'book.copies', 'copies', (qb) =>
        qb.andWhere('copies.status = :status', { status: BookStatus.AVAILABLE }),
      )
      .where('book.id = :id', { id });
    const book = await builder.getOne();
    if (book) {
      const [rentCount] = await this.queryBus.execute(new GetBookRentCountQuery([id]));

      return {
        ...book,
        rentCount: rentCount || 0,
      };
    }
    return null;
  }
}
