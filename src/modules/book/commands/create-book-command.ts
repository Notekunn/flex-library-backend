import { GetOneCategoryQuery } from '@modules/category/queries/get-one-category-query';
import { GetOneStoreQuery } from '@modules/store/queries/get-one-store-query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from '../dto/create-book.dto';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.entity';

export class CreateBookCommand extends Command<CreateBookDto> {
  constructor(public readonly dto: CreateBookDto) {
    super();
  }
}

@CommandHandler(CreateBookCommand)
export class CreateBookCommandHandler implements ICommandHandler<CreateBookCommand> {
  constructor(
    @InjectRepository(BookEntity) private readonly bookRepository: BookRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: CreateBookCommand) {
    const { dto } = command;
    const store = await this.queryBus.execute(new GetOneStoreQuery(dto.storeId));
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    const categories = await this.queryBus.execute(new GetOneCategoryQuery(dto.categoryId));
    if (!categories) {
      throw new NotFoundException('Category not found');
    }
    const book = this.bookRepository.create(dto);
    await this.bookRepository.save(book);
    return book;
  }
}
