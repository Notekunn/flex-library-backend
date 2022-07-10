import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { BookWithCountEntity } from '../entities/book-with-count.entity';
import { BookEntity } from '../entities/book.entity';
import { GetBookRentCountQuery } from './get-book-rentcount.query';

export class MapBookWithCountQuery extends Query<BookWithCountEntity[]> {
  constructor(public readonly books: BookEntity[]) {
    super();
  }
}

@QueryHandler(MapBookWithCountQuery)
export class MapBookWithCountQueryHandler implements IQueryHandler<MapBookWithCountQuery, BookWithCountEntity[]> {
  constructor(private readonly queryBus: QueryBus) {}
  async execute(query: MapBookWithCountQuery) {
    const { books } = query;
    const rentCounts = await this.queryBus.execute(new GetBookRentCountQuery(books.map((e) => e.id)));
    return books.reduce<BookWithCountEntity[]>((prev, book, i) => {
      prev.push({
        ...book,
        rentCount: rentCounts[i] || 0,
      });
      return prev;
    }, []);
  }
}
