import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreCommandHandlers } from './commands';
import { StoreQueryHandlers } from './queries';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreEntity } from './entities/store.entity';

@Module({
  controllers: [StoreController],
  providers: [...StoreCommandHandlers, ...StoreQueryHandlers],
  imports: [TypeOrmModule.forFeature([StoreEntity]), CqrsModule],
})
export class StoreModule {}
