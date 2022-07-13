import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { GetAllBookDto } from '../dto/get-all-book.dto';
import { MapBookWithCountQuery } from './map-book-with-count.query';
import { StoreEntity } from '@modules/store/entities/store.entity';

export class GetAllBookQuery extends Query<BookEntity[]> {
  constructor(public readonly dto: GetAllBookDto) {
    super();
  }
}

@QueryHandler(GetAllBookQuery)
export class GetAllBookQueryHandler implements IQueryHandler<GetAllBookQuery, BookEntity[]> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(query: GetAllBookQuery) {
    const { dto } = query;
    const { q, store } = dto;
    const categories = dto.categories ? (Array.isArray(dto.categories) ? dto.categories : [dto.categories]) : [];

    const builder = this.bookRepository.createQueryBuilder('book');

    if (store) {
      builder.innerJoinAndSelect('book.store', 'store', 'store.id = :store', { store });
    } else {
      builder.leftJoinAndSelect('book.store', 'store');
    }

    if (categories.length > 0) {
      builder.innerJoinAndSelect('book.categories', 'category', 'category.id IN (:...categories)', { categories });
    } else {
      builder.leftJoinAndSelect('book.categories', 'category');
    }

    if (q) {
      builder.andWhere('book.name ILIKE :q', { q: `%${q}%` });
    }

    for (const sortItem of dto.toSortEntries<BookEntity>()) {
      builder.addOrderBy(`book.${sortItem[0]}`, sortItem[1]);
    }
    builder.take(dto.take);
    builder.skip(dto.skip);

    const books = await builder.getMany();

    const booksWithCount = await this.queryBus.execute(new MapBookWithCountQuery(books));

    return booksWithCount;
  }
}
