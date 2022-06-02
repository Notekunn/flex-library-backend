import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookshelfEntity } from '../entities/bookshelf.entity';
import { BookshelfRepository } from '../repositories/bookshelf.repository';

export class GetOneStoreBookQuery extends Query<BookshelfEntity> {
  constructor(public readonly id: number) {
    super();
  }
}
@QueryHandler(GetOneStoreBookQuery)
export class GetOneStoreBookQueryHandler implements IQueryHandler<GetOneStoreBookQuery, BookshelfEntity | null> {
  constructor(
    @InjectRepository(BookshelfEntity)
    private readonly storeBookRepository: BookshelfRepository,
  ) {}
  async execute(query: GetOneStoreBookQuery) {
    const { id } = query;
    return await this.storeBookRepository.findOne({ where: { id } });
  }
}
