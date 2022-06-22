import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllBookCopyDto } from '../dto/get-all-book-copy.dto';
import { BookCopyEntity } from '../entities/book-copy.entity';
import { BookCopyRepository } from '../repositories/book-copy.repository';

export class GetAllBookCopyQuery extends Query<BookCopyEntity[]> {
  constructor(public readonly bookId: number, public readonly dto: GetAllBookCopyDto) {
    super();
  }
}

@QueryHandler(GetAllBookCopyQuery)
export class GetAllBookCopyQueryHandler implements IQueryHandler<GetAllBookCopyQuery> {
  constructor(
    @InjectRepository(BookCopyEntity)
    private readonly bookCopyRepository: BookCopyRepository,
  ) {
    //
  }
  execute(query: GetAllBookCopyQuery) {
    const { bookId, dto } = query;
    const { status, ...paginationDto } = dto;
    return this.bookCopyRepository.find({
      ...paginationDto,
      where: {
        book: {
          id: bookId,
        },
        ...(status ? { status } : {}),
      },
    });
  }
}
