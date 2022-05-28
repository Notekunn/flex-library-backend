import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../entities/store.entity';
import { StoreRepository } from '../repositories/store.entity';

export class GetOneStoreQuery extends Query<StoreEntity | null> {
  constructor(public readonly id: number) {
    super();
  }
}

@QueryHandler(GetOneStoreQuery)
export class GetOneStoreQueryHandler implements IQueryHandler<GetOneStoreQuery, StoreEntity | null> {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: StoreRepository,
  ) {}
  async execute(query: GetOneStoreQuery) {
    const { id } = query;
    return this.storeRepository.findOne({ where: { id } });
  }
}
