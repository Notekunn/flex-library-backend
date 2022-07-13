import { BookStatus } from '@constants/book-status.enum';
import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookCopyEntity } from '../entities/book-copy.entity';
import { BookEntity } from '../entities/book.entity';
import { BookCopyRepository } from '../repositories/book-copy.repository';
import { BookRepository } from '../repositories/book.repository';

export class UpdateNumberOfCopiesCommand extends Command<number> {
  constructor(public readonly bookId: number) {
    super();
  }
}

@CommandHandler(UpdateNumberOfCopiesCommand)
export class UpdateNumberOfCopiesCommandHandler implements ICommandHandler<UpdateNumberOfCopiesCommand> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
    @InjectRepository(BookCopyEntity)
    private readonly bookCopyRepository: BookCopyRepository,
  ) {}
  async execute(command: UpdateNumberOfCopiesCommand): Promise<any> {
    const { bookId } = command;
    const numOfCopies = await this.bookCopyRepository.count({
      where: {
        status: BookStatus.AVAILABLE,
        book: {
          id: bookId,
        },
      },
    });
    return this.bookRepository
      .createQueryBuilder()
      .update()
      .set({
        numOfCopies,
      })
      .where('id = :bookId', { bookId })
      .execute();
  }
}
