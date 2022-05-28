import { Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { StoreCommandHandlers } from './commands';
import { StoreQueryHandlers } from './queries';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreEntity } from './entities/store.entity';
import { StoreBookEntity } from './entities/store-book.entity';
import { StoreBookController } from './controllers/store-book.controller';

@Module({
  controllers: [StoreController, StoreBookController],
  providers: [...StoreCommandHandlers, ...StoreQueryHandlers],
  imports: [TypeOrmModule.forFeature([StoreEntity, StoreBookEntity]), CqrsModule],
})
export class StoreModule {}
