import moment from 'moment';
import { BookStatus } from '@constants/book-status.enum';
import { GetAllBookCopyDto } from '@modules/book/dto/get-all-book-copy.dto';
import { GetAllBookCopyQuery } from '@modules/book/queries/get-all-book-copy.query';
import { GetOneOrderDetailQuery } from '@modules/order/queries/get-one-order-detail.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { BookLoanEntity } from '../entities/book-loan.entity';
import { BookLoanRepository } from '../repositories/book-loan.repository';
import { BookLoanStatus } from '@constants/book-loan-status.enum';
import { UpdateBookStatusCommand } from '@modules/book/commands/update-book-status.command';
import { IncreaseRentCountCommand } from '@modules/book/commands/increase-rentcount.command';
import { UpdateNumberOfCopiesCommand } from '@modules/book/commands/update-number-of-copies.command';

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
    const { book, quantity } = orderDetail;
    const bookCopies = await this.queryBus.execute(
      new GetAllBookCopyQuery(
        book.id,
        new GetAllBookCopyDto({
          status: BookStatus.AVAILABLE,
          take: quantity,
          page: 1,
        }),
      ),
    );
    const doPromises: Promise<BookLoanEntity>[] = [];
    for (const bookCopy of bookCopies) {
      const bookLoan = this.bookLoanRepository.create({
        bookCopy,
        dueDate: moment().add(7, 'days'),
        order: orderDetail.order,
        status: BookLoanStatus.RENTING,
      });
      doPromises.push(this.bookLoanRepository.save(bookLoan));
    }
    await Promise.all(doPromises);
    await this.commandBus.execute(
      new UpdateBookStatusCommand(
        bookCopies.map((e) => e.id),
        BookStatus.RENTING,
      ),
    );
    await Promise.all(
      [new UpdateNumberOfCopiesCommand(book.id), new IncreaseRentCountCommand(book.id, orderDetail.quantity)].map(
        (cmd) => this.commandBus.execute(cmd),
      ),
    );
  }
}
