import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../entities/store.entity';
import { StoreRepository } from '../repositories/store.repository';

export class DeleteStoreCommand extends Command<string> {
  constructor(public readonly ids: number[]) {
    super();
  }
}

@CommandHandler(DeleteStoreCommand)
export class DeleteStoreCommandHandler implements ICommandHandler<DeleteStoreCommand> {
  constructor(@InjectRepository(StoreEntity) private readonly storeRepository: StoreRepository) {}
  async execute(command: DeleteStoreCommand) {
    const { ids } = command;
    const query = this.storeRepository.createQueryBuilder().softDelete().where('id IN (:...ids)', { ids });
    return query.execute();
  }
}
