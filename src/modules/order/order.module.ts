import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCommandHandlers } from './commands';
import { OrderDetailController } from './controllers/order-detail.controller';
import { OrderController } from './controllers/order.controller';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderQueryHandlers } from './queries';

@Module({
  controllers: [OrderController, OrderDetailController],
  providers: [...OrderCommandHandlers, ...OrderQueryHandlers],
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity]), CqrsModule],
})
export class OrderModule {}