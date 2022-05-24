import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginWithEmailCommand } from './commands/verify-login.command';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.commandBus.execute(
      new LoginWithEmailCommand({
        email,
        password,
      }),
    );

    return user;
  }
}
