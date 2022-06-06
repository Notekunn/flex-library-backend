import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../entities/store.entity';
import { StoreRepository } from '../repositories/store.repository';

export class GetStoreByOwnerQuery extends Query<StoreEntity> {
  constructor(public readonly userId: number) {
    super();
  }
}

@QueryHandler(GetStoreByOwnerQuery)
export class GetStoreByOwnerQueryHandler implements IQueryHandler<GetStoreByOwnerQuery, StoreEntity | null> {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: StoreRepository,
  ) {}
  execute(query: GetStoreByOwnerQuery) {
    const { userId } = query;
    return this.storeRepository.findOne({
      where: {
        owner: {
          id: userId,
        },
      },
    });
  }
}
