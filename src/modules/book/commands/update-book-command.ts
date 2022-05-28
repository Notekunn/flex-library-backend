import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class UpdateBookCommand extends Command<UpdateBookDto> {
  constructor(public readonly id: number, public readonly dto: UpdateBookDto) {
    super();
  }
}

@CommandHandler(UpdateBookCommand)
export class UpdateBookCommandHandler implements ICommandHandler<UpdateBookCommand> {
  constructor(
    @InjectRepository(BookEntity) private readonly bookRepository: BookRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: UpdateBookCommand) {
    const { id, dto } = command;
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const updatedBook = await this.bookRepository.save({
      ...book,
      ...dto,
    });

    return updatedBook;
  }
}
