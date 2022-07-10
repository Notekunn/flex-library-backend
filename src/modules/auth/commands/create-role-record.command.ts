import { RedisKey } from '@constants/redis-key';
import { UserRole } from '@constants/user-role.enum';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

export class CreateRoleRecordCommand extends Command<void> {
  constructor(public readonly userId: number, public readonly role: UserRole) {
    super();
  }
}

@CommandHandler(CreateRoleRecordCommand)
export class CreateRoleRecordCommandHandler implements ICommandHandler<CreateRoleRecordCommand> {
  constructor(private readonly redisService: RedisService) {}

  async execute(command: CreateRoleRecordCommand) {
    const { userId, role } = command;
    await this.redisService.getClient().set(`${RedisKey.Role}:${userId}`, role.toString());
  }
}
