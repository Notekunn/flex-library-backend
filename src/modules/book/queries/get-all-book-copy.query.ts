import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllBookCopyDto } from '../dto/get-all-book-copy.dto';
import { BookCopyEntity } from '../entities/book-copy.entity';
import { BookCopyRepository } from '../repositories/book-copy.repository';

export class GetAllBookCopyQuery extends Query<string> {
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
    return this.bookCopyRepository.find({
      ...dto,
      where: {
        book: {
          id: bookId,
        },
      },
    });
  }
}
