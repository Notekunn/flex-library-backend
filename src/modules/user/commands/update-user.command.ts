import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserDto } from './../dto/update-user.dto';
import { Command } from '@nestjs-architects/typed-cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

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
  ) {}
  async execute(command: UpdateUserCommand): Promise<any> {
    const { userId, dto } = command;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException();
    const updatedUser = await this.userRepository.save({
      ...user,
      ...dto,
    });
    return this.userRepository.create(updatedUser);
  }
}
