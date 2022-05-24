import { UserEntity } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthCommandHandler } from './commands';
import { LocalStrategy } from './local.strategy';

@Module({
  controllers: [AuthController],
  providers: [LocalStrategy, ...AuthCommandHandler],
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
})
export class AuthModule {}
