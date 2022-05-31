import { Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { StoreCommandHandlers } from './commands';
import { StoreQueryHandlers } from './queries';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreEntity } from './entities/store.entity';
import { BookshelfEntity } from './entities/bookshelf.entity';
import { StoreBookController } from './controllers/bookshelf.controller';

@Module({
  controllers: [StoreController, StoreBookController],
  providers: [...StoreCommandHandlers, ...StoreQueryHandlers],
  imports: [TypeOrmModule.forFeature([StoreEntity, BookshelfEntity]), CqrsModule],
})
export class StoreModule {}
