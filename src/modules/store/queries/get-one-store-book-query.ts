import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreBookEntity } from '../entities/store-book.entity';
import { StoreBookRepository } from '../repositories/storeBook.repository';

export class GetOneStoreBookQuery extends Query<StoreBookEntity> {
  constructor(public readonly id: number) {
    super();
  }
}
@QueryHandler(GetOneStoreBookQuery)
export class GetOneStoreBookQueryHandler implements IQueryHandler<GetOneStoreBookQuery, StoreBookEntity | null> {
  constructor(
    @InjectRepository(StoreBookEntity)
    private readonly storeBookRepository: StoreBookRepository,
  ) {}
  async execute(query: GetOneStoreBookQuery) {
    const { id } = query;
    return await this.storeBookRepository.findOne({ where: { id } });
  }
}
