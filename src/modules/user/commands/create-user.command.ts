import { Command } from '@nestjs-architects/typed-cqrs';
import { CreateUserDto } from '../dto/create-user.dto';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UtilsService } from '@providers/utils.service';
import { I18nService } from 'nestjs-i18n';
import { GetUserByEmailQuery } from '../queries/get-user-by-email.query';
import { BadRequestException } from '@nestjs/common';

export class CreateUserCommand extends Command<UserEntity> {
  constructor(public readonly dto: CreateUserDto) {
    super();
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
    private readonly i18n: I18nService,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(command: CreateUserCommand) {
    const { dto } = command;
    const _user = await this.queryBus.execute(new GetUserByEmailQuery(dto.email));
    if (_user) {
      throw new BadRequestException(this.i18n.t('exception.emailHasBeenTaken'));
    }
    const hashPassword = UtilsService.generateHash(dto.password);
    const user = await this.userRepository.save(
      this.userRepository.create({
        ...dto,
        password: hashPassword,
      }),
    );
    return user;
  }
}
