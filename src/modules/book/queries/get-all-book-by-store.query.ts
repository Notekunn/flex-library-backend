import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class GetAllBookByStoreQuery extends Query<BookEntity[]> {
  constructor(public readonly storeId: number, public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetAllBookByStoreQuery)
export class GetAllBookByStoreQueryHandler implements IQueryHandler<GetAllBookByStoreQuery, BookEntity[]> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  execute(query: GetAllBookByStoreQuery) {
    const { storeId, dto } = query;
    return this.bookRepository.find({
      ...dto,
      where: {
        store: {
          id: storeId,
        },
      },
      relations: ['categories'],
    });
  }
}
