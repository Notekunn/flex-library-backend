import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayMentCommandHandlers } from './commands';
import { PaymentPackageController } from './controllers/payment-package.controller';
import { PaymentPackageEntity } from './entity/payment-package.entity';
import { PayMentQueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PaymentPackageEntity])],
  controllers: [PaymentPackageController],
  providers: [...PayMentCommandHandlers, ...PayMentQueryHandlers],
})
export class PaymentPackageModule {}
