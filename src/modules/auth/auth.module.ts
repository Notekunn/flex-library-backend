import { UserEntity } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@shared/services/config.service';
import { AuthController } from './auth.controller';
import { AuthCommandHandler } from './commands';
import { LocalStrategy } from './local.strategy';

@Module({
  controllers: [AuthController],
  providers: [LocalStrategy, ...AuthCommandHandler, ConfigService],
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
})
export class AuthModule {}
