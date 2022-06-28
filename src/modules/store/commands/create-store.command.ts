import { UserRole } from '@constants/user-role.enum';
import { ChangeRoleCommand } from '@modules/user/commands/change-role.command';
import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateStoreDto } from '../dto/create-store.dto';
import { StoreEntity } from '../entities/store.entity';
import { GetStoreByOwnerQuery } from '../queries/get-store-by-owner.query';
import { StoreRepository } from '../repositories/store.repository';

export class CreateStoreCommand extends Command<CreateStoreDto> {
  constructor(public readonly ownerId: number, public readonly dto: CreateStoreDto) {
    super();
  }
}
@CommandHandler(CreateStoreCommand)
export class CreateStoreCommandHandler implements ICommandHandler<CreateStoreCommand> {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: StoreRepository,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: CreateStoreCommand) {
    const { dto, ownerId } = command;
    const user = await this.queryBus.execute(new GetOneUserQuery(ownerId));

    if (!user) {
      throw new NotFoundException(this.i18n.t('exception.userNotFound'));
    }

    if (user.role === UserRole.Member) {
      await this.commandBus.execute(new ChangeRoleCommand(user.id, UserRole.Owner));
    }

    const existedStore = await this.queryBus.execute(new GetStoreByOwnerQuery(ownerId));
    if (existedStore) {
      throw new BadRequestException(this.i18n.t('message.duplicateStore'));
    }
    const store = this.storeRepository.create(dto);
    store.owner = user;
    return await this.storeRepository.save(store);
  }
}
