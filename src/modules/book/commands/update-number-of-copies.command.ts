import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class UpdateNumberOfCopiesCommand extends Command<number> {
  constructor(public readonly bookId: number, public readonly increaseNumber: number) {
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
    const { bookId, increaseNumber } = command;
    // const numOfCopies = await this.bookRepository.
    return this.bookRepository
      .createQueryBuilder()
      .update()
      .set({
        numOfCopies: increaseNumber,
      })
      .where('id = :bookId', { bookId })
      .execute();
  }
}
