import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class CalculateTotalAmountQuery extends Query<number> {
  constructor(public readonly orderId: number) {
    super();
  }
}

@QueryHandler(CalculateTotalAmountQuery)
export class CalculateTotalAmountQueryHandler implements IQueryHandler<CalculateTotalAmountQuery> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRespository: OrderDetailRepository,
  ) {}
  async execute(query: CalculateTotalAmountQuery) {
    const { orderId } = query;
    const orderDetails = await this.orderDetailRespository.find({
      where: {
        order: {
          id: orderId,
        },
      },
      relations: ['book', 'orders'],
    });

    const amount = orderDetails.reduce((amount, orderDetail) => {
      return amount + orderDetail.book.rentPrice * orderDetail.quantity;
    }, 0);

    return amount;
  }
}
