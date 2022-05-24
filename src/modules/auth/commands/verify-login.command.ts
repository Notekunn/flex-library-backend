import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginRequestDto } from '../dto/login-request.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Command } from '@nestjs-architects/typed-cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/repositories/user.repository';

export class LoginWithEmailCommand extends Command<UserEntity> {
  constructor(public readonly dto: LoginRequestDto) {
    super();
  }
}

@CommandHandler(LoginWithEmailCommand)
export class LoginWithEmailCommandHandler implements ICommandHandler<LoginWithEmailCommand, UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}
  async execute(command: LoginWithEmailCommand): Promise<UserEntity> {
    const { dto } = command;
  }
}
