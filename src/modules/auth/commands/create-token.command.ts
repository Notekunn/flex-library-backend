import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Command } from '@nestjs-architects/typed-cqrs';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@shared/services/config.service';

export class CreateTokenCommand extends Command<TokenPayloadDto> {
  constructor(public readonly user: UserEntity) {
    super();
  }
}

@CommandHandler(CreateTokenCommand)
export class CreateTokenCommandHandler implements ICommandHandler<CreateTokenCommand, TokenPayloadDto> {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
  async execute(command: CreateTokenCommand): Promise<TokenPayloadDto> {
    const { user } = command;
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    const { exp } = this.jwtService.verify(accessToken);

    return new TokenPayloadDto({
      accessToken,
      accessTokenExpired: new Date(exp * 1000).toISOString(),
    });
  }
}
