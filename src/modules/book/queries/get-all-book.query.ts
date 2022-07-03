import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { GetAllBookDto } from '../dto/get-all-book.dto';
import { FindOptionsOrder, FindOptionsWhere, Like } from 'typeorm';

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
    const { q, sort, ...paginationDto } = dto;

    const where: FindOptionsWhere<BookEntity> = {};
    if (q) {
      where.name = Like(`%${q}%`);
    }

    const order: FindOptionsOrder<BookEntity> = {};
    if (sort) {
      const sortArray = Array.isArray(sort) ? sort : [sort];
      for (const sortItem of sortArray) {
        const [field, sortType] = sortItem.split(':');
        if (field) {
          order[field] = sortType || 'ASC';
        }
      }
    }

    const books = await this.bookRepository.find({
      ...paginationDto,
      where,
      relations: ['store', 'categories'],
      order,
    });
    return books;
  }
}
