import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { BookEntity } from '../entities/book.entity';
import { GetOneBookQuery } from '../queries/get-one-book.query';
import { BookRepository } from '../repositories/book.repository';

export class DeleteBookCommand extends Command<number> {
  constructor(public readonly id: number) {
    super();
  }
}
@CommandHandler(DeleteBookCommand)
export class DeleteBookCommandHandler implements ICommandHandler<DeleteBookCommand> {
  constructor(
    @InjectRepository(BookEntity) private readonly bookRepository: BookRepository,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: DeleteBookCommand) {
    const { id } = command;
    const book = await this.queryBus.execute(new GetOneBookQuery(id));
    if (!book) {
      throw new NotFoundException(this.i18n.t('exception.bookNotFound'));
    }
    await this.bookRepository.softDelete(book.id);
    return book;
  }
}
