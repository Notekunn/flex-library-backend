import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserCommandHandler } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { UserQueryHandler } from './queries';

@Module({
  controllers: [UserController],
  providers: [...UserCommandHandler, ...UserQueryHandler],
  imports: [TypeOrmModule.forFeature([UserEntity]), CqrsModule],
})
export class UserModule {}
