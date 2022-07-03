import { OrderStatus } from '@constants/order-status.enum';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetailEntity } from '../entities/order-detail.entity';

export class GetOrderDetailByBookQuery extends Query<OrderDetailEntity> {
  constructor(public readonly userId: number, public readonly bookId: number) {
    super();
  }
}

@QueryHandler(GetOrderDetailByBookQuery)
export class GetOrderDetailByBookQueryHandler implements IQueryHandler<GetOrderDetailByBookQuery> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>,
  ) {
    //
  }
  async execute(query: GetOrderDetailByBookQuery): Promise<any> {
    const { bookId, userId } = query;
    return this.orderDetailRepository.findOne({
      where: {
        book: {
          id: bookId,
        },
        order: {
          status: OrderStatus.CREATED,
          user: {
            id: userId,
          },
        },
      },
      relations: ['book', 'order'],
    });
  }
}
