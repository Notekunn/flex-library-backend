import { Command } from '@nestjs-architects/typed-cqrs';
import { CreateUserDto } from '../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

export class CreateUserCommand extends Command<CreateUserDto> {
  constructor(public readonly dto: CreateUserDto) {
    super();
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}
  async execute(command: CreateUserCommand) {
    const { dto } = command;
    const user = await this.userRepository.save(this.userRepository.create(dto));
    return user;
  }
}
