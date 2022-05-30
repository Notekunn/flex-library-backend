import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDto } from '../dto/create-store.dto';
import { StoreEntity } from '../entities/store.entity';
import { StoreRepository } from '../repositories/store.repository';

export class CreateStoreCommand extends Command<CreateStoreDto> {
  constructor(public readonly ownerId: number, public readonly dto: CreateStoreDto) {
    super();
  }
}
@CommandHandler(CreateStoreCommand)
export class CreateStoreCommandHandler implements ICommandHandler<CreateStoreCommand> {
  constructor(
    @InjectRepository(StoreEntity) private readonly storeRepository: StoreRepository,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: CreateStoreCommand) {
    const { dto, ownerId } = command;
    const user = await this.queryBus.execute(new GetOneUserQuery(ownerId));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const store = this.storeRepository.create(dto);
    store.owner = user;
    return await this.storeRepository.save(store);
  }
}
