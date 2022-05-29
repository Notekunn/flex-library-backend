import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { StoreEntity } from '../entities/store.entity';
import { StoreRepository } from '../repositories/store.repository';

export class UpdateStoreCommand extends Command<UpdateStoreDto> {
  constructor(public readonly id: number, public readonly dto: UpdateStoreDto) {
    super();
  }
}
@CommandHandler(UpdateStoreCommand)
export class UpdateStoreCommandHandler implements ICommandHandler<UpdateStoreCommand> {
  constructor(@InjectRepository(StoreEntity) private readonly storeRepository: StoreRepository) {}
  async execute(command: UpdateStoreCommand) {
    const { dto, id } = command;
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    Object.assign(store, dto);
    return store;
  }
}
