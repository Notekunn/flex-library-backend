import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class GetAllBookByCategoryQuery extends Query<BookEntity[]> {
  constructor(public readonly categoryId: number, public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetAllBookByCategoryQuery)
export class GetAllBookByCategoryQueryHandler implements IQueryHandler<GetAllBookByCategoryQuery, BookEntity[]> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  execute(query: GetAllBookByCategoryQuery) {
    const { categoryId, dto } = query;
    return this.bookRepository.find({
      ...dto,
      where: {
        categories: {
          id: categoryId,
        },
      },
      relations: ['categories'],
    });
  }
}
