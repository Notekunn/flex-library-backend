import { GetOneStoreQuery } from '@modules/store/queries/get-one-store.query';
import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { GetOderByUserQuery } from '../queries/get-order-by-user.query';
import { OrderRepository } from '../repositories/order.repository';

export class CreateOrderCommand extends Command<OrderEntity> {
  constructor(public readonly userId: number, public readonly dto: CreateOrderDto) {
    super();
  }
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: OrderRepository,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: CreateOrderCommand) {
    const { userId, dto } = command;
    const { storeId, ...dataToCreate } = dto;

    const existedOrder = await this.queryBus.execute(new GetOderByUserQuery(userId, storeId));
    if (existedOrder) {
      return existedOrder;
    }

    const user = await this.queryBus.execute(new GetOneUserQuery(userId));
    if (!user) {
      throw new NotFoundException(this.i18n.t('exception.userNotFound'));
    }

    const store = await this.queryBus.execute(new GetOneStoreQuery(storeId));
    if (!store) {
      throw new NotFoundException(this.i18n.t('exception.storeNotFound'));
    }

    const order = this.orderRepository.create(dataToCreate);
    order.user = user;
    order.store = store;
    return await this.orderRepository.save(order);
  }
}
