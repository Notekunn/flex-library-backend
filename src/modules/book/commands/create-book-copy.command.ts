import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { BookCopyEntity } from '../entities/book-copy.entity';

export class CreateBookCopyCommand extends Command<BookCopyEntity> {
  constructor(public readonly bookId: number) {
    super();
  }
}

@CommandHandler(CreateBookCopyCommand)
export class CreateBookCopyCommandHandler implements ICommandHandler<CreateBookCopyCommand> {
  constructor() {
    //
  }
  async execute(command: CreateBookCopyCommand): Promise<any> {
    //
  }
}
