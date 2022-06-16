import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';

export class OrderRepository extends Repository<OrderEntity> {}
