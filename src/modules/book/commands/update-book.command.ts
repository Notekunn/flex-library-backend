import { CategoryEntity } from '@modules/category/entities/category.entity';
import { GetOneCategoryQuery } from '@modules/category/queries/get-one-category.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';
import { UpdateNumberOfCopiesCommand } from './update-number-of-copies.command';

export class UpdateBookCommand extends Command<UpdateBookDto> {
  constructor(public readonly id: number, public readonly dto: UpdateBookDto) {
    super();
  }
}

@CommandHandler(UpdateBookCommand)
export class UpdateBookCommandHandler implements ICommandHandler<UpdateBookCommand> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: UpdateBookCommand) {
    const { id, dto } = command;
    console.log(dto);

    const { categoryIds, ...dataToUpdate } = dto;
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const updatedBook = await this.bookRepository.create({
      ...book,
      ...dataToUpdate,
    });

    // TODO: Implement p-limit
    if (categoryIds) {
      const categories = await Promise.all(categoryIds.map((id) => this.queryBus.execute(new GetOneCategoryQuery(id))));
      updatedBook.categories = categories.filter((category) => category) as CategoryEntity[];
    }
    await Promise.all([
      this.bookRepository.save(updatedBook),
      this.commandBus.execute(new UpdateNumberOfCopiesCommand(id)),
    ]);

    return updatedBook;
  }
}
