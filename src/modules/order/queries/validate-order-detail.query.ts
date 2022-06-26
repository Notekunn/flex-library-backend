import { BookEntity } from '@modules/book/entities/book.entity';
import { BookRepository } from '@modules/book/repositories/book.repository';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
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
    console.log(order);

    const books = await this.bookRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', {
        ids: order.orderDetails.map((e) => e.id),
      })
      .getMany();
    console.log(books);

    // const isValid = books.every((book) => {
    //   const orderDetail = order.orderDetails.find((o) => (o.book.id = book.id));
    //   return orderDetail?.quantity <= book.
    // });
  }
}
