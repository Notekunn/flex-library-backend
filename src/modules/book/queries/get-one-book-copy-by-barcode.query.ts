import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookCopyEntity } from '../entities/book-copy.entity';
import { BookCopyRepository } from '../repositories/book-copy.repository';

export class GetOneBookCopyByBarcodeQuery extends Query<BookCopyEntity> {
  constructor(public readonly barcode: string) {
    super();
  }
}

@QueryHandler(GetOneBookCopyByBarcodeQuery)
export class GetOneBookCopyByBarcodeQueryHandler implements IQueryHandler<GetOneBookCopyByBarcodeQuery> {
  constructor(
    @InjectRepository(BookCopyEntity)
    private readonly bookCopyRepository: BookCopyRepository,
  ) {}
  execute(query: GetOneBookCopyByBarcodeQuery) {
    const { barcode } = query;
    return this.bookCopyRepository.findOne({
      where: {
        barcode,
      },
      relations: ['book'],
    });
  }
}