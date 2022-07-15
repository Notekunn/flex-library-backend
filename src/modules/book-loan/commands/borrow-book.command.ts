import moment from 'moment';
import { GetOneOrderDetailQuery } from '@modules/order/queries/get-one-order-detail.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { BookLoanEntity } from '../entities/book-loan.entity';
import { BookLoanRepository } from '../repositories/book-loan.repository';
import { IncreaseRentCountCommand } from '@modules/book/commands/increase-rentcount.command';
import { UpdateNumberOfCopiesCommand } from '@modules/book/commands/update-number-of-copies.command';
import { BookLoanStatus } from '@constants/book-loan-status.enum';

export class BorrowBookCommand extends Command<BookLoanEntity> {
  constructor(public readonly orderDetailId: number) {
    super();
  }
}

@CommandHandler(BorrowBookCommand)
export class BorrowBookCommandHandler implements ICommandHandler<BorrowBookCommand> {
  constructor(
    @InjectRepository(BookLoanEntity)
    private readonly bookLoanRepository: BookLoanRepository,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: BorrowBookCommand): Promise<any> {
    const { orderDetailId } = command;
    const orderDetail = await this.queryBus.execute(new GetOneOrderDetailQuery(orderDetailId));
    if (!orderDetail) {
      throw new NotFoundException(this.i18n.t('exception.orderDetailNotFound'));
    }
    // const dueDate = orderDetail?.order?.dueDate;
    // if (dueDate && moment(dueDate).isBefore(moment())) {
    //   throw new BadRequestException(this.i18n.t('exception.dueDateExpired'));
    // }
    const { book, quantity } = orderDetail;
    for (let i = 0; i < quantity; i++) {
      await this.bookLoanRepository.create({
        book,
        dueDate: moment().add('7', 'days').toDate(),
        order: orderDetail.order,
        status: BookLoanStatus.RENTING,
      });
    }
    await Promise.all(
      [
        new UpdateNumberOfCopiesCommand(book.id, -orderDetail.quantity),
        new IncreaseRentCountCommand(book.id, orderDetail.quantity),
      ].map((cmd) => this.commandBus.execute(cmd)),
    );
  }
}
