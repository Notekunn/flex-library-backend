import { RedisKey } from '@constants/redis-key';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

export class IncreaseRentCountCommand extends Command<void> {
  constructor(public readonly bookId: number, public readonly quantity: number) {
    super();
  }
}

@CommandHandler(IncreaseRentCountCommand)
export class IncreaseRentCountCommandHandler implements ICommandHandler<IncreaseRentCountCommand, void> {
  constructor(private readonly redisService: RedisService) {}
  async execute(command: IncreaseRentCountCommand): Promise<void> {
    const { bookId, quantity } = command;
    await this.redisService.getClient().incrby(`${RedisKey.BookRentCount}:${bookId}`, quantity);
  }
}
