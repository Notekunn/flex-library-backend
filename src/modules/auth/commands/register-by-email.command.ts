import { CreateUserCommand } from '@modules/user/commands/create-user.command';
import { GetUserByEmailQuery } from '@modules/user/queries/get-user-by-email.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus, CommandBus } from '@nestjs/cqrs';
import { I18nService } from 'nestjs-i18n';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { CreateTokenCommand } from './create-token.command';

export class RegisterByEmailCommand extends Command<string> {
  constructor(public readonly dto: RegisterRequestDto) {
    super();
  }
}

@CommandHandler(RegisterByEmailCommand)
export class RegisterByEmailCommandHandler implements ICommandHandler<RegisterByEmailCommand> {
  constructor(private readonly commandBus: CommandBus) {}
  async execute(command: RegisterByEmailCommand): Promise<LoginResponseDto> {
    const { dto } = command;
    const createdUser = await this.commandBus.execute(new CreateUserCommand(dto));
    const token = await this.commandBus.execute(new CreateTokenCommand(createdUser));
    return {
      user: createdUser,
      token,
    };
  }
}
