import { BookStatus } from '@constants/book-status.enum';
import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { BookCopyEntity } from '../entities/book-copy.entity';
import { BookCopyRepository } from '../repositories/book-copy.repository';

export class UpdateBookStatusCommand extends Command<void> {
  constructor(public readonly ids: number[], public readonly status: BookStatus) {
    super();
  }
}

@CommandHandler(UpdateBookStatusCommand)
export class UpdateBookStatusCommandHandler implements ICommandHandler<UpdateBookStatusCommand> {
  constructor(
    @InjectRepository(BookCopyEntity)
    private readonly bookCopyRepository: BookCopyRepository,
  ) {}
  async execute(command: UpdateBookStatusCommand) {
    const { ids, status } = command;
    await this.bookCopyRepository.update(
      {
        id: In(ids),
      },
      {
        status,
      },
    );
  }
}
