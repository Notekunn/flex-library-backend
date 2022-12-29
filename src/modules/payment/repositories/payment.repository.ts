import { Repository } from 'typeorm';
import { PaymentPackageEntity } from '../entity/payment-package.entity';

export class PaymentPackageRepository extends Repository<PaymentPackageEntity> {}
