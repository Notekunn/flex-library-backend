import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StoreEntity } from '../entities/store.entity';

export class CheckOwnerStoreQuery extends Query<boolean> {
  constructor(public readonly store: StoreEntity, public readonly userId: number) {
    super();
  }
}

@QueryHandler(CheckOwnerStoreQuery)
export class CheckOwnerStoreQueryHandler implements IQueryHandler<CheckOwnerStoreQuery> {
  async execute(query: CheckOwnerStoreQuery): Promise<any> {
    const { store, userId } = query;
    return store?.owner?.id === userId;
  }
}
