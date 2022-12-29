import { BookEntity } from '../entities/book.entity';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from '../repositories/book.repository';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';

export class GetAllBookByBarcodeQuery extends Query<BookEntity[]> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetAllBookByBarcodeQuery)
export class GetAllBookByBarcodeQueryHandler implements IQueryHandler<GetAllBookByBarcodeQuery, BookEntity[]> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  async execute(query: GetAllBookByBarcodeQuery) {
    const { id } = query;
    // const { q, sort, ...paginationDto } = dto;
    const data = this.bookRepository.find({
      where: {
        barcode: id,
      },
      relations: ['store'],
    });
    return data;
  }
}
