import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class GetOneOrderDetailQuery extends Query<OrderDetailEntity | null> {
  constructor(public readonly id: number) {
    super();
  }
}

@QueryHandler(GetOneOrderDetailQuery)
export class GetOneOrderDetailQueryHandler implements IQueryHandler<GetOneOrderDetailQuery, OrderDetailEntity | null> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: OrderDetailRepository,
  ) {}
  async execute(query: GetOneOrderDetailQuery) {
    const { id } = query;
    const orderDetail = await this.orderDetailRepository.findOne({
      where: {
        id,
      },
      relations: ['book', 'order'],
    });
    return orderDetail;
  }
}
