import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { GetAllBookDto } from '../dto/get-all-book.dto';
import { FindOptionsWhere, ILike } from 'typeorm';

export class GetAllBookQuery extends Query<BookEntity[]> {
  constructor(public readonly dto: GetAllBookDto) {
    super();
  }
}

@QueryHandler(GetAllBookQuery)
export class GetAllBookQueryHandler implements IQueryHandler<GetAllBookQuery, BookEntity[]> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  async execute(query: GetAllBookQuery) {
    const { dto } = query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { q, sort, ...paginationDto } = dto;

    const where: FindOptionsWhere<BookEntity> = {};
    if (q) {
      where.name = ILike(`%${q}%`);
    }
    const order = dto.toQueryOrder<BookEntity>();

    const books = await this.bookRepository.find({
      ...paginationDto,
      where,
      relations: ['store', 'categories'],
      order,
    });
    return books;
  }
}
