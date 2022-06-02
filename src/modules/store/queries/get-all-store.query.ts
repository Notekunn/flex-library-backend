import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../entities/store.entity';
import { StoreRepository } from '../repositories/store.repository';

export class GetAllStoreQuery extends Query<PaginationDto> {
  constructor(public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetAllStoreQuery)
export class GetAllStoreQueryHandler implements IQueryHandler<GetAllStoreQuery> {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: StoreRepository,
  ) {}
  async execute(query: GetAllStoreQuery): Promise<any> {
    const { dto } = query;
    const stores = await this.storeRepository.find({ ...dto, relations: ['owner'] });
    return stores;
  }
}
