import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

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
  ) {}
  async execute(query: GetOneOrderQuery) {
    const { id } = query;
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: ['orderDetails', 'user'],
    });
    return order;
  }
}
