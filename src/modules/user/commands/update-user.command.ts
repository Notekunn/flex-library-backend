import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserDto } from './../dto/update-user.dto';
import { Command } from '@nestjs-architects/typed-cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateStoreCommand } from '@modules/store/commands/update-store.command';
import { UtilsService } from '@providers/utils.service';

export class UpdateUserCommand extends Command<UpdateUserDto> {
  constructor(public readonly userId: number, public readonly dto: UpdateUserDto) {
    super();
  }
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: UpdateUserCommand): Promise<any> {
    const { userId, dto } = command;
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['store'] });
    if (!user) throw new NotFoundException();
    const updatedUser = await this.userRepository.save({
      ...user,
      ...dto,
      ...(dto.password
        ? {
            password: UtilsService.generateHash(dto.password),
          }
        : {}),
    });
    if (user.store && user.avatar && updatedUser.avatar !== user.store.avatarURL) {
      await this.commandBus.execute(
        new UpdateStoreCommand(user.id, user.store.id, {
          avatarURL: user.avatar,
        }),
      );
    }
    return this.userRepository.create(updatedUser);
  }
}
