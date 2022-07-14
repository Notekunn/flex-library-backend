import { RedisService } from '@liaoliaots/nestjs-redis';
import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

export class IncreaseRentCountCommand extends Command<void> {
  constructor(public readonly bookId: number, public readonly quantity: number) {
    super();
  }
}

@CommandHandler(IncreaseRentCountCommand)
export class IncreaseRentCountCommandHandler implements ICommandHandler<IncreaseRentCountCommand, void> {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
  ) {}
  async execute(command: IncreaseRentCountCommand): Promise<void> {
    const { bookId, quantity } = command;
    //TODO: store to redis and reupdate to postgres
    // const rentCountKey = `${RedisKey.BookRentCount}:${bookId}`;
    // const currentQuantity = await this.redisService.getClient().incrby(`${RedisKey.BookRentCount}:${bookId}`, quantity);
    // if (currentQuantity >= 50) {
    //   return
    // }
    await this.bookRepository
      .createQueryBuilder()
      .update()
      .set({
        rentCount: () => `rent_count + ${quantity}`,
      })
      .where('id = :bookId', { bookId })
      .execute();
  }
}
