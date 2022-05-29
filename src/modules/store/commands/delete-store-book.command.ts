import { Command } from '@nestjs-architects/typed-cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../entities/store.entity';
import { StoreRepository } from '../repositories/store.repository';

export class DeleteStoreBookCommand extends Command<string> {
  constructor(public readonly ids: number[]) {
    super();
  }
}

@CommandHandler(DeleteStoreBookCommand)
export class DeleteStoreBookCommandHandler implements ICommandHandler<DeleteStoreBookCommand> {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: StoreRepository,
  ) {}
  execute(command: DeleteStoreBookCommand) {
    const { ids } = command;

    const query = this.storeRepository.createQueryBuilder().softDelete().where('id IN (:...ids)', { ids });

    return query.execute();
  }
}
