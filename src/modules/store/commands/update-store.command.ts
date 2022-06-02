import { Command } from '@nestjs-architects/typed-cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { StoreEntity } from '../entities/store.entity';
import { CheckOwnerStoreQuery } from '../queries/check-owner-store.query';
import { GetOneStoreQuery } from '../queries/get-one-store.query';
import { StoreRepository } from '../repositories/store.repository';

export class UpdateStoreCommand extends Command<UpdateStoreDto> {
  constructor(public readonly userId, public readonly storeId: number, public readonly dto: UpdateStoreDto) {
    super();
  }
}
@CommandHandler(UpdateStoreCommand)
export class UpdateStoreCommandHandler implements ICommandHandler<UpdateStoreCommand> {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: StoreRepository,
    private readonly queryBus: QueryBus,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: UpdateStoreCommand) {
    const { dto, storeId, userId } = command;
    const store = await this.queryBus.execute(new GetOneStoreQuery(storeId));
    if (!store) {
      throw new NotFoundException(this.i18n.t('exception.storeNotFound'));
    }
    const isOwnerStore = await this.queryBus.execute(new CheckOwnerStoreQuery(store, userId));

    if (!isOwnerStore) {
      throw new ForbiddenException(this.i18n.t('exception.notStoreOwner'));
    }

    const updatedStore = this.storeRepository.create({
      ...store,
      ...dto,
    });

    await this.storeRepository.save(updatedStore);
    return updatedStore;
  }
}
