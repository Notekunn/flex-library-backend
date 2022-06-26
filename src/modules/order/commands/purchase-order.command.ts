import { OrderStatus } from '@constants/order-status.enum';
import { BorrowBookCommand } from '@modules/book-loan/commands/borrow-book.command';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { I18nService } from 'nestjs-i18n';
import { GetOneOrderQuery } from '../queries/get-one-order.query';
import { ValidateOrderDetailQuery } from '../queries/validate-order-detail.query';

export class PurchaseOrderCommand extends Command<void> {
  constructor(public readonly userId: number, public readonly orderId: number) {
    super();
  }
}

@CommandHandler(PurchaseOrderCommand)
export class PurchaseOrderCommandHandler implements ICommandHandler<PurchaseOrderCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: PurchaseOrderCommand): Promise<any> {
    const order = await this.queryBus.execute(new GetOneOrderQuery(command.orderId));
    if (!order) {
      throw new NotFoundException(this.i18n.t('exception.notFoundOrder'));
    }
    if (order.user.id != command.userId) {
      throw new ForbiddenException(this.i18n.t('exception.notOwner'));
    }
    if (order.orderDetails.length === 0) {
      throw new BadRequestException(this.i18n.t('exception.emptyOrder'));
    }
    if (order.status === OrderStatus.PURCHASED) {
      throw new BadRequestException(this.i18n.t('exception.orderJustComplete'));
    }
    const isValid = await this.queryBus.execute(new ValidateOrderDetailQuery(order));
    // //TODO: Use transaction
    // for (const orderDetail of order.orderDetails) {
    //   await this.commandBus.execute(new BorrowBookCommand(orderDetail.id));
    // }
  }
}
