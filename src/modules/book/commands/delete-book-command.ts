import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { GetOneBookQuery } from '../queries/get-one-book-query';
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
  ) {}
  async execute(command: DeleteBookCommand) {
    const { id } = command;
    const book = await this.queryBus.execute(new GetOneBookQuery(id));
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    book.deletedAt = new Date();
    const updatedBook = await this.bookRepository.save(book);
    return updatedBook;
  }
}
