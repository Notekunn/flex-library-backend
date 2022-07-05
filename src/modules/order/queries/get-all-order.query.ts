import { OrderStatus } from '@constants/order-status.enum';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllOrderDto } from '../dto/get-all-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { GetAllOrderDetailQuery } from './get-all-order-detail.query';

export class GetAllOrderQuery extends Query<OrderEntity[]> {
  constructor(public readonly userId: number, public readonly dto: GetAllOrderDto) {
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
    const {
      dto: { status, ...paginationDto },
      userId,
    } = query;

    const orders = await this.orderRepository.find({
      ...paginationDto,
      where: {
        user: {
          id: userId,
        },
        status: status || OrderStatus.CREATED,
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
