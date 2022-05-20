import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Command } from '@nestjs-architects/typed-cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

export class DeleteUserCommand extends Command<string> {
  constructor(public readonly ids: number[]) {
    super();
  }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}
  execute(command: DeleteUserCommand) {
    const { ids } = command;

    const query = this.userRepository.createQueryBuilder().softDelete().where('id IN (:...ids)', { ids });

    return query.execute();
  }
}
