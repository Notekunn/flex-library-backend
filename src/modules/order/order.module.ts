import { BookEntity } from '@modules/book/entities/book.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCommandHandlers, OrderDetailCommandHandlers } from './commands';
import { OrderDetailController } from './controllers/order-detail.controller';
import { OrderController } from './controllers/order.controller';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailQueryHandlers, OrderQueryHandlers } from './queries';

@Module({
  controllers: [OrderController, OrderDetailController],
  providers: [
    ...OrderCommandHandlers,
    ...OrderDetailCommandHandlers,
    ...OrderQueryHandlers,
    ...OrderDetailQueryHandlers,
  ],
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity, BookEntity, UserEntity]), CqrsModule],
})
export class OrderModule {}
