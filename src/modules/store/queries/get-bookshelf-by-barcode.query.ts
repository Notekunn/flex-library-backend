import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookshelfEntity } from '../entities/bookshelf.entity';
import { BookshelfRepository } from '../repositories/bookshelf.repository';

export class GetBookshelfByBarcodeQuery extends Query<BookshelfEntity> {
  constructor(public readonly storeId: number, public readonly barcode: string) {
    super();
  }
}

@QueryHandler(GetBookshelfByBarcodeQuery)
export class GetBookshelfByBarcodeQueryHandler implements IQueryHandler<GetBookshelfByBarcodeQuery> {
  constructor(
    @InjectRepository(BookshelfEntity)
    private readonly bookshelfRepository: BookshelfRepository,
  ) {}
  execute(query: GetBookshelfByBarcodeQuery): Promise<any> {
    const { storeId, barcode } = query;
    const builder = this.bookshelfRepository
      .createQueryBuilder()
      .select()
      .where('store_id = :storeId', { storeId })
      .andWhere('barcode = :barcode', { barcode });

    return builder.execute();
  }
}
