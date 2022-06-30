import { OrderStatus } from '@constants/order-status.enum';
import { GetOneBookQuery } from '@modules/book/queries/get-one-book.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { GetOneOrderQuery } from '../queries/get-one-order.query';
import { GetOderByUserQuery } from '../queries/get-order-by-user.query';
import { GetOrderDetailByBookQuery } from '../queries/get-order-detail-by-book';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';
import { CreateOrderCommand } from './create-order.command';
import { DeleteOrderDetailCommand } from './delete-order-detail.command';
import { UpdateOrderDetailCommand } from './update-order-detail.command';

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
    private readonly commandBus: CommandBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: CreateOrderDetailCommand) {
    const { userId, dto } = command;
    const { bookId, ...dataToCreate } = dto;
    const book = await this.queryBus.execute(new GetOneBookQuery(bookId));
    if (!book) {
      throw new NotFoundException(this.i18n.t('exception.bookNotFound'));
    }
    const order = await this.queryBus.execute(new GetOderByUserQuery(userId, book.store.id));
    if (order) {
      const existedOrderDetail = await this.queryBus.execute(new GetOrderDetailByBookQuery(bookId));
      if (existedOrderDetail) {
        const cmd =
          dto.quantity > 0
            ? new UpdateOrderDetailCommand(existedOrderDetail.id, dto)
            : new DeleteOrderDetailCommand([existedOrderDetail.id]);
        await this.commandBus.execute(cmd);
        return await this.queryBus.execute(new GetOneOrderQuery(existedOrderDetail.order.id));
      }
      if (dto.quantity <= 0) {
        return await this.queryBus.execute(new GetOneOrderQuery(order.id));
      }
    }
    const neworder = await this.commandBus.execute(
      new CreateOrderCommand(userId, {
        status: OrderStatus.CREATED,
        storeId: book.store.id,
      }),
    );

    const orderDetail = this.orderDetailRepository.create(dataToCreate);
    orderDetail.book = book;
    orderDetail.order = neworder;
    await this.orderDetailRepository.save(orderDetail);
    return await this.queryBus.execute(new GetOneOrderQuery(neworder.id));
  }
}
