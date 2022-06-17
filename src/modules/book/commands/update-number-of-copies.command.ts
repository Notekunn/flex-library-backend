import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class UpdateNumberOfCopiesCommand extends Command<number> {
  constructor(public readonly numberIncrease = 1) {
    super();
  }
}

@CommandHandler(UpdateNumberOfCopiesCommand)
export class UpdateNumberOfCopiesCommandHandler implements ICommandHandler<UpdateNumberOfCopiesCommand> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  async execute(command: UpdateNumberOfCopiesCommand): Promise<any> {
    return this.bookRepository
      .createQueryBuilder()
      .update()
      .set({
        numOfCopies: () => `numOfCopies + ${command.numberIncrease}`,
      })
      .execute();
  }
}
