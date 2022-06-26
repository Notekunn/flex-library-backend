import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

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
    });
    return orders;
  }
}
