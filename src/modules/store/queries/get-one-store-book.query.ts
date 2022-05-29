import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookshelfEntity } from '../entities/store-book.entity';
import { StoreBookRepository } from '../repositories/storeBook.repository';

export class GetOneStoreBookQuery extends Query<BookshelfEntity> {
  constructor(public readonly id: number) {
    super();
  }
}
@QueryHandler(GetOneStoreBookQuery)
export class GetOneStoreBookQueryHandler implements IQueryHandler<GetOneStoreBookQuery, BookshelfEntity | null> {
  constructor(
    @InjectRepository(BookshelfEntity)
    private readonly storeBookRepository: StoreBookRepository,
  ) {}
  async execute(query: GetOneStoreBookQuery) {
    const { id } = query;
    return await this.storeBookRepository.findOne({ where: { id } });
  }
}
