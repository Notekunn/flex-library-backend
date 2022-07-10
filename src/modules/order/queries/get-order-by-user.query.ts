import { OrderStatus } from '@constants/order-status.enum';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { GetAllOrderDetailQuery } from './get-all-order-detail.query';

export class GetOderByUserQuery extends Query<OrderEntity | null> {
  constructor(public readonly userId: number, public readonly storeId: number) {
    super();
  }
}

@QueryHandler(GetOderByUserQuery)
export class GetOneOrderByUserQueryHandler implements IQueryHandler<GetOderByUserQuery, OrderEntity | null> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(query: GetOderByUserQuery) {
    const { userId, storeId } = query;

    const order = await this.orderRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        store: {
          id: storeId,
        },
        status: OrderStatus.CREATED,
      },
      relations: ['user'],
    });

    if (order) {
      order.orderDetails = await this.queryBus.execute(new GetAllOrderDetailQuery(order.id));
    }

    return order;
  }
}
