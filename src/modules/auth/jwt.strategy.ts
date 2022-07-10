import { QueryBus } from '@nestjs/cqrs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@shared/services/config.service';
import { JwtClaimsDto } from './dto/jwt-claims.dto';
import { GetRoleRecordQuery } from './queries/get-user-role.command';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(PassportStrategy.name);

  constructor(public readonly configService: ConfigService, private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({ id: userId }): Promise<JwtClaimsDto> {
    const role = await this.queryBus.execute(new GetRoleRecordQuery(userId));

    this.logger.debug(`Claim token userId ${userId} with role ${role}`);

    return {
      id: userId,
      role: role,
    };
  }
}
