import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { GetAllOrderDetailQuery } from './get-all-order-detail.query';

export class GetAllOrderQuery extends Query<OrderEntity[]> {
  constructor(public readonly userId: number, public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetAllOrderQuery)
export class GetAllOrderQueryHandler implements IQueryHandler<GetAllOrderQuery, OrderEntity[]> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(query: GetAllOrderQuery) {
    const { dto, userId } = query;

    const orders = await this.orderRepository.find({
      ...dto,
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user', 'store'],
    });

    const orderWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderDetails = await this.queryBus.execute(new GetAllOrderDetailQuery(order.id));
        order.orderDetails = orderDetails;
        return this.orderRepository.create(order);
      }),
    );
    return orderWithDetails;
  }
}
