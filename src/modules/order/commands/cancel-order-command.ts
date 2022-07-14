import { OrderStatus } from '@constants/order-status.enum';
import { UpdateCoinCommand } from '@modules/user/commands/update-coin.command';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, CommandBus, QueryBus } from '@nestjs/cqrs';
import { I18nService } from 'nestjs-i18n';
import { GetOneOrderQuery } from '../queries/get-one-order.query';
import { UpdateOrderCommand } from './update-order.command';

export class CancelOrderCommand extends Command<void> {
  constructor(public readonly orderId: number) {
    super();
  }
}

@CommandHandler(CancelOrderCommand)
export class CancelOrderCommandHandler implements ICommandHandler<CancelOrderCommand, void> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: CancelOrderCommand): Promise<void> {
    const { orderId } = command;
    const order = await this.queryBus.execute(new GetOneOrderQuery(orderId));
    if (!order) {
      throw new NotFoundException(this.i18n.t('exception.orderNotFound'));
    }
    if (order.status !== OrderStatus.PURCHASED) {
      throw new BadRequestException(this.i18n.t('exception.haveToPurchase'));
    }
    const coinChange = Math.ceil(order.totalAmount / 1000);
    // Refund
    await this.commandBus.execute(new UpdateCoinCommand(order.user.id, coinChange));

    await this.commandBus.execute(
      new UpdateOrderCommand(orderId, {
        status: OrderStatus.CANCELLED,
      }),
    );
  }
}
