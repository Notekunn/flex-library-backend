import { Repository } from 'typeorm';
import { OrderDetailEntity } from '../entities/order-detail.entity';

export class OrderDetailRepository extends Repository<OrderDetailEntity> {}
