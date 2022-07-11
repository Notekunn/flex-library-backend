import { OrderDetailAction } from '@constants/order-detail-action';
import { OrderStatus } from '@constants/order-status.enum';
import { GetOneBookQuery } from '@modules/book/queries/get-one-book.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { OrderDetailEntity } from '../entities/order-detail.entity';
import { GetOderByUserQuery } from '../queries/get-order-by-user.query';
import { GetOrderDetailByBookQuery } from '../queries/get-order-detail-by-book';
import { OrderDetailRepository } from '../repositories/oder-detail.repository';
import { CreateOrderCommand } from './create-order.command';
import { DeleteOrderDetailCommand } from './delete-order-detail.command';
import { GetNewQuantityCommand } from './get-new-quantity.command';
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
    const { bookId, action = OrderDetailAction.SET, quantity } = dto;
    const book = await this.queryBus.execute(new GetOneBookQuery(bookId));
    if (!book) {
      throw new NotFoundException(this.i18n.t('exception.bookNotFound'));
    }

    const existedOrderDetail = await this.queryBus.execute(new GetOrderDetailByBookQuery(userId, bookId));

    const doTask = await this.commandBus.execute(
      new GetNewQuantityCommand(quantity, action, existedOrderDetail?.quantity),
    );

    if (doTask.quantity > book.numOfCopies) {
      throw new BadRequestException(this.i18n.t('exception.bookNotEnough'));
    }
    const order = await this.commandBus.execute(
      new CreateOrderCommand(userId, {
        status: OrderStatus.CREATED,
        storeId: book.store.id,
      }),
    );
    if (!order) {
      throw new BadRequestException(this.i18n.t('exception.cannotCreateOrder'));
    }
    switch (doTask.action) {
      case 'delete':
        await this.commandBus.execute(new DeleteOrderDetailCommand([existedOrderDetail.id]));
        break;
      case 'insert':
        const orderDetail = this.orderDetailRepository.create({ quantity: doTask.quantity });
        orderDetail.book = book;
        orderDetail.order = order;
        await this.orderDetailRepository.save(orderDetail);
        break;
      case 'update':
        await this.commandBus.execute(
          new UpdateOrderDetailCommand(existedOrderDetail.id, { quantity: doTask.quantity }),
        );
        break;
      case 'donothing':
      default:
        break;
    }

    return await this.queryBus.execute(new GetOderByUserQuery(userId, book.store.id));
  }
}
