import { BookLoanStatus } from '@constants/book-loan-status.enum';
import { ReturnBookType } from '@constants/return-book-type.enum';
import { UpdateNumberOfCopiesCommand } from '@modules/book/commands/update-number-of-copies.command';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { ReturnBookDto } from '../dto/return-book.dto';
import { BookLoanEntity } from '../entities/book-loan.entity';
import { BookLoanRepository } from '../repositories/book-loan.repository';

export class ReturnBookCommand extends Command<void> {
  constructor(public readonly userId: number, public readonly loanId: number, public readonly dto: ReturnBookDto) {
    super();
  }
}

@CommandHandler(ReturnBookCommand)
export class ReturnBookCommandHandler implements ICommandHandler<ReturnBookCommand> {
  constructor(
    @InjectRepository(BookLoanEntity)
    private readonly bookLoanRepository: BookLoanRepository,
    private readonly commandBus: CommandBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: ReturnBookCommand): Promise<any> {
    const { userId, loanId, dto } = command;
    const bookLoan = await this.bookLoanRepository.findOneBy({
      id: loanId,
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

    const loanStatus: BookLoanStatus =
      dto.status === ReturnBookType.LOST ? BookLoanStatus.LOST : BookLoanStatus.COMPLETE;
    await this.bookLoanRepository.update(
      {
        id: bookLoan.id,
      },
      {
        status: loanStatus,
      },
    );
    if (dto.status === ReturnBookType.LOST) {
      await this.commandBus.execute(new UpdateNumberOfCopiesCommand(bookLoan.book.id, 1));
    }
    return {
      message: 'Return book success',
    };
  }
}
