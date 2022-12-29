import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

export class UpdateCoinCommand extends Command<void> {
  constructor(public readonly userId: number, public readonly amount: number) {
    super();
  }
}

@CommandHandler(UpdateCoinCommand)
export class UpdateCoinCommandHandler implements ICommandHandler<UpdateCoinCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}
  async execute(command: UpdateCoinCommand): Promise<any> {
    const { userId, amount } = command;
    const query = this.userRepository
      .createQueryBuilder()
      .update()
      .set({
        coin: () => `coin ${amount > 0 ? '+' : '-'} ${Math.abs(amount)}`,
      })
      .where('id = :userId', { userId });
    return query.execute();
  }
}
