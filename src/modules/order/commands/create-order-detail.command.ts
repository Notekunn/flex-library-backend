import { GetOneBookQuery } from '@modules/book/queries/get-one-book.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { GetOderByUserQuery } from '../queries/get-order-by-user.query';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';

export class CreateOrderDetailCommand extends Command<OrderDetailEntity> {
  constructor(public readonly userId: number, public readonly dto: CreateOrderDetailDto) {
    super();
  }
}

@CommandHandler(CreateOrderDetailCommand)
export class CreateOrderDetailCommandHandler implements ICommandHandler<CreateOrderDetailCommand> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: CreateOrderDetailCommand) {
    const { userId, dto } = command;

    const order = await this.queryBus.execute(new GetOderByUserQuery(userId));
    if (!order) {
      throw new NotFoundException(`Order with id ${userId} not found`);
    }
    console.log(order);
    const { bookId, ...dataToCreate } = dto;
    const orderDetail = this.orderDetailRepository.create(dataToCreate);
    const book = await this.queryBus.execute(new GetOneBookQuery(bookId));
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }
    orderDetail.book = book;
    orderDetail.order = order;
    return this.orderDetailRepository.save(orderDetail);
  }
}
