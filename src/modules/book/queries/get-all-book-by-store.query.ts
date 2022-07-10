import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import { BookWithCountEntity } from '../entities/book-with-count.entity';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { MapBookWithCountQuery } from './map-book-with-count.query';

export class GetAllBookByStoreQuery extends Query<BookWithCountEntity[]> {
  constructor(public readonly storeId: number, public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetAllBookByStoreQuery)
export class GetAllBookByStoreQueryHandler implements IQueryHandler<GetAllBookByStoreQuery, BookWithCountEntity[]> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(query: GetAllBookByStoreQuery) {
    const { storeId, dto } = query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { q, sort, ...paginationDto } = dto;

    const order = dto.toQueryOrder<BookEntity>();
    const books = await this.bookRepository.find({
      ...paginationDto,
      where: {
        store: {
          id: storeId,
        },
        ...(q ? { name: ILike(`%${q}%`) } : {}),
      },
      relations: ['categories'],
      order,
    });
    const booksWithCount = await this.queryBus.execute(new MapBookWithCountQuery(books));

    return booksWithCount;
  }
}
