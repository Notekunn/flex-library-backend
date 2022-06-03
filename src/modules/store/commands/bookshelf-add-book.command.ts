import { GetOneBookQuery } from '@modules/book/queries/get-one-book.query';
import { BookshelfAddBookDto } from '../dto/bookshelf-add-book.dto';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { BookshelfEntity } from '../entities/bookshelf.entity';
import { CheckOwnerStoreQuery } from '../queries/check-owner-store.query';
import { GetOneStoreQuery } from '../queries/get-one-store.query';
import { BookshelfRepository } from '../repositories/bookshelf.repository';
import { GetBookshelfByBarcodeQuery } from '../queries/get-bookshelf-by-barcode.query';

export class BookshelfAddBookCommand extends Command<BookshelfEntity> {
  constructor(
    public readonly userId: number,
    public readonly storeId: number,
    public readonly dto: BookshelfAddBookDto,
  ) {
    super();
  }
}

@CommandHandler(BookshelfAddBookCommand)
export class BookshelfAddBookCommandHandler implements ICommandHandler<BookshelfAddBookCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
    @InjectRepository(BookshelfEntity)
    private readonly bookshelfRepository: BookshelfRepository,
  ) {}

  async execute(command: BookshelfAddBookCommand): Promise<any> {
    const { userId, storeId, dto } = command;
    const { bookId, barcode, ...dataToCreate } = dto;
    const [store, book] = await Promise.all(
      [new GetOneStoreQuery(storeId), new GetOneBookQuery(bookId)].map((e) => this.queryBus.execute(e)),
    );

    if (!store) {
      throw new NotFoundException(this.i18n.t('exception.storeNotFound'));
    }

    if (!book) {
      throw new BadRequestException(this.i18n.t('exception.bookNotFound'));
    }

    const isOwner = await this.queryBus.execute(new CheckOwnerStoreQuery(store, userId));
    if (!isOwner) {
      throw new ForbiddenException(this.i18n.t('exception.notStoreOwner'));
    }
    const existedBookshelf = await this.queryBus.execute(new GetBookshelfByBarcodeQuery(storeId, barcode));

    if (existedBookshelf) {
      throw new BadRequestException(this.i18n.t('exception.duplicateBarcode'));
    }
    const bookshelf = this.bookshelfRepository.create(dataToCreate);
    bookshelf.barcode = barcode;
    bookshelf.book = book;
    await this.bookshelfRepository.save(bookshelf);
    return bookshelf;
  }
}
