import { UserEntity } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@shared/services/config.service';
import { AuthController } from './auth.controller';
import { AuthCommandHandler } from './commands';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthQueryHandlers } from './queries';

@Module({
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, ...AuthCommandHandler, ...AuthQueryHandlers, ConfigService],
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
