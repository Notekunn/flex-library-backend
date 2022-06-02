import { Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { BookshelfCommandHandlers, StoreCommandHandlers } from './commands';
import { BookshelfQueryHandlers, StoreQueryHandlers } from './queries';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreEntity } from './entities/store.entity';
import { BookshelfEntity } from './entities/bookshelf.entity';
import { BookshelfController } from './controllers/bookshelf.controller';

@Module({
  controllers: [StoreController, BookshelfController],
  providers: [...StoreCommandHandlers, ...BookshelfCommandHandlers, ...StoreQueryHandlers, ...BookshelfQueryHandlers],
  imports: [TypeOrmModule.forFeature([StoreEntity, BookshelfEntity]), CqrsModule],
})
export class StoreModule {}
