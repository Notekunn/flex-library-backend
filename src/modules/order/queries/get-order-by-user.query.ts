import { OrderStatus } from '@constants/order-status.enum';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

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

    return order;
  }
}
