import { Query } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class GetAllOrderDetailQuery extends Query<OrderDetailEntity[]> {
  constructor(public readonly orderId: number) {
    super();
  }
}

@CommandHandler(GetAllOrderDetailQuery)
export class GetAllOrderDetailQueryHandler implements IQueryHandler<GetAllOrderDetailQuery, OrderDetailEntity[]> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: OrderDetailRepository,
  ) {}
  async execute(query: GetAllOrderDetailQuery) {
    const { orderId } = query;
    const ordersDetail = await this.orderDetailRepository.find({
      where: {
        order: {
          id: orderId,
        },
      },
      relations: ['book', 'order'],
    });
    return ordersDetail;
  }
}
