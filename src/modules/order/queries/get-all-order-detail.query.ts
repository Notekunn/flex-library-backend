import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class GetAllOrderDetailQuery extends Query<OrderDetailEntity[]> {
  constructor(public readonly dto: PaginationDto) {
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
    const { dto } = query;
    const ordersDetail = await this.orderDetailRepository.find({
      ...dto,
    });
    return ordersDetail;
  }
}
