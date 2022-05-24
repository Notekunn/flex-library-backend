import { QueryBus } from '@nestjs/cqrs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@shared/services/config.service';
import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(PassportStrategy.name);

  constructor(public readonly configService: ConfigService, private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({ id: userId }: { id: number }) {
    this.logger.debug(`Claim token userId ${userId}`);
    const user = await this.queryBus.execute(new GetOneUserQuery(userId));
    if (!user) throw new UnauthorizedException('User is not valid');
    return user;
  }
}
