import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

export class GetOderByUserQuery extends Query<OrderEntity | null> {
  constructor(public readonly userId: number) {
    super();
  }
}

@QueryHandler(GetOderByUserQuery)
export class GetOneOrderQueryHandler implements IQueryHandler<GetOderByUserQuery, OrderEntity | null> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
  ) {}
  async execute(query: GetOderByUserQuery) {
    const { userId } = query;
    const order = await this.orderRepository.findOne({ where: { user: { id: userId } } });
    return order;
  }
}
