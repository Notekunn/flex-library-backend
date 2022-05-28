import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class GetOneBookQuery extends Query<BookEntity | null> {
  constructor(public readonly id: number) {
    super();
  }
}
@QueryHandler(GetOneBookQuery)
export class GetOneBookQueryHandler implements IQueryHandler<GetOneBookQuery, BookEntity | null> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  async execute(query: GetOneBookQuery) {
    const { id } = query;
    const book = await this.bookRepository.findOne({ where: { id } });
    return book;
  }
}
