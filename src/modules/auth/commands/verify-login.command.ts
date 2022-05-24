import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginRequestDto } from '../dto/login-request.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Command } from '@nestjs-architects/typed-cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { UtilsService } from '@providers/utils.service';

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
    const user = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (!user) throw new UnauthorizedException('Thông tin đăng nhập không chính xác!');
    const isPasswordValid = await UtilsService.validateHash(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác!');
    }

    return user;
  }
}
