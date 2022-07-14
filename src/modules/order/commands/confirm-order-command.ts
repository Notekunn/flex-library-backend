import { OrderStatus } from '@constants/order-status.enum';
import { BorrowBookCommand } from '@modules/book-loan/commands/borrow-book.command';
import { GetOneStoreQuery } from '@modules/store/queries/get-one-store.query';
import { UpdateCoinCommand } from '@modules/user/commands/update-coin.command';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, CommandBus, QueryBus } from '@nestjs/cqrs';
import { I18nService } from 'nestjs-i18n';
import { GetOneOrderQuery } from '../queries/get-one-order.query';
import { UpdateOrderCommand } from './update-order.command';

export class ConfirmOrderCommand extends Command<void> {
  constructor(public readonly orderId: number) {
    super();
  }
}

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderCommandHandler implements ICommandHandler<ConfirmOrderCommand, void> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: ConfirmOrderCommand): Promise<void> {
    const { orderId } = command;
    const order = await this.queryBus.execute(new GetOneOrderQuery(orderId));
    if (!order) {
      throw new NotFoundException(this.i18n.t('exception.orderNotFound'));
    }
    if (order.status !== OrderStatus.PURCHASED) {
      throw new BadRequestException(this.i18n.t('exception.haveToPurchase'));
    }

    for (const orderDetail of order.orderDetails) {
      await this.commandBus.execute(new BorrowBookCommand(orderDetail.id));
    }

    const store = await this.queryBus.execute(new GetOneStoreQuery(order.store.id));
    const coinChange = Math.ceil(order.totalAmount / 1000);
    await this.commandBus.execute(new UpdateCoinCommand(store?.owner?.id || -1, coinChange));

    await this.commandBus.execute(
      new UpdateOrderCommand(orderId, {
        status: OrderStatus.COMPLETED,
      }),
    );
  }
}
