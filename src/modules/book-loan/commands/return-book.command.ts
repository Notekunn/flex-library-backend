import { BookLoanStatus } from '@constants/book-loan-status.enum';
import { BookStatus } from '@constants/book-status.enum';
import { ReturnBookType } from '@constants/return-book-type.enum';
import { UpdateBookStatusCommand } from '@modules/book/commands/update-book-status.command';
import { UpdateNumberOfCopiesCommand } from '@modules/book/commands/update-number-of-copies.command';
import { GetOneBookCopyByBarcodeQuery } from '@modules/book/queries/get-one-book-copy-by-barcode.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { ReturnBookDto } from '../dto/return-book.dto';
import { BookLoanEntity } from '../entities/book-loan.entity';
import { BookLoanRepository } from '../repositories/book-loan.repository';

export class ReturnBookCommand extends Command<void> {
  constructor(public readonly userId: number, public readonly dto: ReturnBookDto) {
    super();
  }
}

@CommandHandler(ReturnBookCommand)
export class ReturnBookCommandHandler implements ICommandHandler<ReturnBookCommand> {
  constructor(
    @InjectRepository(BookLoanEntity)
    private readonly bookLoanRepository: BookLoanRepository,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: ReturnBookCommand): Promise<any> {
    const { userId, dto } = command;
    const bookCopy = await this.queryBus.execute(new GetOneBookCopyByBarcodeQuery(dto.barcode));
    if (!bookCopy) {
      throw new BadRequestException(this.i18n.t('exception.bookCopyNotFound'));
    }
    const bookLoan = await this.bookLoanRepository.findOneBy({
      bookCopy: {
        id: bookCopy.id,
      },
      order: {
        user: {
          id: userId,
        },
      },
      status: BookLoanStatus.RENTING,
    });
    if (!bookLoan) {
      throw new BadRequestException(this.i18n.t('exception.notBorrowThisBook'));
    }

    await this.bookLoanRepository.update(
      {
        id: bookLoan.id,
      },
      {
        status: BookLoanStatus.COMPLETE,
      },
    );
    const bookStatus: BookStatus = dto.status === ReturnBookType.LOST ? BookStatus.LOST : BookStatus.AVAILABLE;
    await this.commandBus.execute(new UpdateBookStatusCommand([bookCopy.id], bookStatus));
    await this.commandBus.execute(new UpdateNumberOfCopiesCommand(bookCopy.book.id));
    return {
      message: 'Return book success',
    };
  }
}
