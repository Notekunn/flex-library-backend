import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryCommandHandlers } from './commands';
import { CategoryEntity } from './entities/category.entity';
import { CategoryQueryHandlers } from './queries';

@Module({
  controllers: [CategoryController],
  providers: [...CategoryCommandHandlers, ...CategoryQueryHandlers],
  imports: [TypeOrmModule.forFeature([CategoryEntity]), CqrsModule],
})
export class CategoryModule {}
