import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { GetAllOrderDetailQuery } from './get-all-order-detail.query';

export class GetOneOrderQuery extends Query<OrderEntity | null> {
  constructor(public readonly id: number) {
    super();
  }
}

@QueryHandler(GetOneOrderQuery)
export class GetOneOrderQueryHandler implements IQueryHandler<GetOneOrderQuery, OrderEntity | null> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(query: GetOneOrderQuery) {
    const { id } = query;
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    if (order) {
      order.orderDetails = await this.queryBus.execute(new GetAllOrderDetailQuery(id));
    }
    return order;
  }
}
