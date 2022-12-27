import { UserRepository } from '@modules/user/repositories/user.repository';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryBuilder } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { Query } from '@nestjs-architects/typed-cqrs';
import { UserEntity } from '@modules/user/entities/user.entity';
import { GetAllOrderDetailQuery } from './get-all-order-detail.query';
import { OrderStatus } from '@constants/order-status.enum';
import { GetAllOrderDto } from '../dto/get-all-order.dto';

export class GetAllOrdersByStoreQuery extends Query<OrderEntity[]> {
  constructor(public readonly userId: number, public readonly dto: GetAllOrderDto) {
    super();
  }
}

@QueryHandler(GetAllOrdersByStoreQuery)
export class GetAllOrdersByStoreQueryHandler implements IQueryHandler<GetAllOrdersByStoreQuery, OrderEntity[]> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(query: GetAllOrdersByStoreQuery) {
    const {
      dto: { status, ...paginationDto },
      userId,
    } = query;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['store'],
    });
    if (!user?.store) {
      throw new NotFoundException('This account is not create store');
    }
    const data = await this.orderRepository.find({
      where: {
        store: {
          id: user.store.id,
        },
        status: Not(OrderStatus.CREATED) && status,
      },
      relations: ['user'],
    });
    const orderWithDetails = await Promise.all(
      data.map(async (order) => {
        const orderDetails = await this.queryBus.execute(new GetAllOrderDetailQuery(order.id));
        order.orderDetails = orderDetails;
        return this.orderRepository.create(order);
      }),
    );
    return orderWithDetails;
  }
}
