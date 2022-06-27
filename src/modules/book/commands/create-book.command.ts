import { CategoryEntity } from '@modules/category/entities/category.entity';
import { GetOneCategoryQuery } from '@modules/category/queries/get-one-category.query';
import { GetStoreByOwnerQuery } from '@modules/store/queries/get-store-by-owner.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateBookDto } from '../dto/create-book.dto';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class CreateBookCommand extends Command<CreateBookDto> {
  constructor(public readonly userId: number, public readonly dto: CreateBookDto) {
    super();
  }
}

@CommandHandler(CreateBookCommand)
export class CreateBookCommandHandler implements ICommandHandler<CreateBookCommand> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
    private readonly i18n: I18nService,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: CreateBookCommand) {
    const { userId, dto } = command;
    const store = await this.queryBus.execute(new GetStoreByOwnerQuery(userId));
    if (!store) {
      throw new NotFoundException(this.i18n.t('exception.notRegisterStore'));
    }
    const { categoryIds, ...dataToCreate } = dto;
    // TODO: Implement p-limit
    const categories = await Promise.all(categoryIds.map((id) => this.queryBus.execute(new GetOneCategoryQuery(id))));
    const book = this.bookRepository.create(dataToCreate);
    book.categories = categories.filter((e) => e) as CategoryEntity[];
    book.store = store;
    await this.bookRepository.save(book);
    return book;
  }
}
