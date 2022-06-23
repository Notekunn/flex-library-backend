import { BookStatus } from '@constants/book-status.enum';
import { GetAllBookCopyDto } from '@modules/book/dto/get-all-book-copy.dto';
import { GetAllBookCopyQuery } from '@modules/book/queries/get-all-book-copy.query';
import { GetOneOrderDetailQuery } from '@modules/order/queries/get-one-order-detail.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { I18nService } from 'nestjs-i18n';
import { BookLoanEntity } from '../entities/book-loan.entity';

export class BorrowBookCommand extends Command<BookLoanEntity> {
  constructor(public readonly orderDetailId: number) {
    super();
  }
}

@CommandHandler(BorrowBookCommand)
export class BorrowBookCommandHandler implements ICommandHandler<BorrowBookCommand> {
  constructor(private readonly queryBus: QueryBus, private readonly i18n: I18nService) {
    //
  }
  async execute(command: BorrowBookCommand): Promise<any> {
    const { orderDetailId } = command;
    const orderDetail = await this.queryBus.execute(new GetOneOrderDetailQuery(orderDetailId));
    if (!orderDetail) {
      throw new NotFoundException(this.i18n.t('exception.orderDetailNotFound'));
    }
    const { book, quantity } = orderDetail;
    const bookCopies = this.queryBus.execute(
      new GetAllBookCopyQuery(
        book.id,
        new GetAllBookCopyDto({
          status: BookStatus.AVAILABLE,
          take: quantity,
          page: 1,
        }),
      ),
    );
    console.log(bookCopies);
  }
}
