import { BookStatus } from '@constants/book-status.enum';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { GetStoreByOwnerQuery } from '@modules/store/queries/get-store-by-owner';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateBookCopyDto } from '../dto/create-book-copy.dto';
import { BookCopyEntity } from '../entities/book-copy.entity';
import { BookEntity } from '../entities/book.entity';
import { GetOneBookCopyByBarcodeQuery } from '../queries/get-one-book-copy-by-barcode.query';
import { GetOneBookQuery } from '../queries/get-one-book.query';
import { BookCopyRepository } from '../repositories/book-copy.repository';

export class CreateBookCopyCommand extends Command<BookCopyEntity> {
  constructor(public readonly userId: number, public readonly bookId: number, public readonly dto: CreateBookCopyDto) {
    super();
  }
}

@CommandHandler(CreateBookCopyCommand)
export class CreateBookCopyCommandHandler implements ICommandHandler<CreateBookCopyCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
    @InjectRepository(BookCopyEntity)
    private readonly bookCopyRepository: BookCopyRepository,
  ) {}
  async execute(command: CreateBookCopyCommand) {
    const { bookId, dto, userId } = command;
    const [book, store, bookWithSameBarcode] = (await Promise.all(
      [
        new GetOneBookQuery(bookId),
        new GetStoreByOwnerQuery(userId),
        new GetOneBookCopyByBarcodeQuery(bookId, dto.barcode),
      ].map((e) => this.queryBus.execute(e)),
    )) as [BookEntity, StoreEntity, BookCopyEntity];

    if (book.store.id !== store.id) {
      throw new ForbiddenException();
    }
    if (bookWithSameBarcode) {
      throw new BadRequestException(this.i18n.t('exception.duplicateBarcode'));
    }
    const bookCopy = this.bookCopyRepository.create({
      ...dto,
      book,
      status: BookStatus.AVAILABLE,
    });
    await this.bookCopyRepository.save(bookCopy);

    return bookCopy;
  }
}
