import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookshelfEntity } from '../entities/store-book.entity';
import { StoreBookRepository } from '../repositories/storeBook.repository';

export class GetAllStoreBookQuery extends Query<BookshelfEntity> {
  constructor(public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetAllStoreBookQuery)
export class GetAllStoreBookQueryHandler implements IQueryHandler<GetAllStoreBookQuery> {
  constructor(
    @InjectRepository(BookshelfEntity)
    private readonly storeBookRepository: StoreBookRepository,
  ) {}
  async execute(query: GetAllStoreBookQuery) {
    const { dto } = query;
    const storeBooks = await this.storeBookRepository.find({ ...dto });
    return storeBooks;
  }
}
