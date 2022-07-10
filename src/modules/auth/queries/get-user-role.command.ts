import { RedisKey } from '@constants/redis-key';
import { UserRole } from '@constants/user-role.enum';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';
import { Query } from '@nestjs-architects/typed-cqrs';
import { CommandBus, IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { UtilsService } from '@providers/utils.service';
import { CreateRoleRecordCommand } from '../commands/create-role-record.command';

export class GetRoleRecordQuery extends Query<UserRole> {
  constructor(public readonly userId: number) {
    super();
  }
}

@QueryHandler(GetRoleRecordQuery)
export class GetRoleRecordQueryHandler implements IQueryHandler<GetRoleRecordQuery, UserRole> {
  constructor(
    private readonly redisService: RedisService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(query: GetRoleRecordQuery): Promise<UserRole> {
    const { userId } = query;
    const role = await this.redisService.getClient().get(`${RedisKey.Role}:${userId}`);
    if (role) {
      return UtilsService.enumFromStringValue(UserRole, role) || UserRole.Member;
    }
    const user = await this.queryBus.execute(new GetOneUserQuery(userId));
    await this.commandBus.execute(new CreateRoleRecordCommand(userId, user.role));
    return user.role;
  }
}
