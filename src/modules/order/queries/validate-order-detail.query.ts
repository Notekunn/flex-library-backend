import { BookEntity } from '@modules/book/entities/book.entity';
import { BookRepository } from '@modules/book/repositories/book.repository';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';

export class ValidateOrderDetailQuery extends Query<boolean> {
  constructor(public readonly order: OrderEntity) {
    super();
  }
}

@QueryHandler(ValidateOrderDetailQuery)
export class ValidateOrderDetailQueryHandler implements IQueryHandler<ValidateOrderDetailQuery> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  async execute(query: ValidateOrderDetailQuery): Promise<any> {
    const { order } = query;
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .where('id IN (:...ids)', {
        ids: order.orderDetails.map((e) => e.book.id),
      })
      .getMany();

    const isValid = order.orderDetails.every((orderItem) => {
      const mappedBook = books.find((e) => e.id == orderItem.book.id);
      return mappedBook && mappedBook.numOfCopies >= orderItem.quantity;
    });

    return isValid;
  }
}
