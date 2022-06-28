import { UserRole } from '@constants/user-role.enum';
import { Command } from '@nestjs-architects/typed-cqrs';
import { NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

export class ChangeRoleCommand extends Command<UserEntity> {
  constructor(public readonly userId: number, public readonly role: UserRole) {
    super();
  }
}

@CommandHandler(ChangeRoleCommand)
export class ChangeRoleCommandHandler implements ICommandHandler<ChangeRoleCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
    private readonly i18n: I18nService,
  ) {}
  async execute(command: ChangeRoleCommand): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: command.userId });
    if (!user) {
      throw new NotFoundException(this.i18n.t('exception.userNotFound'));
    }
    user.role = command.role;
    await this.userRepository.update(user.id, user);
    return user;
  }
}
