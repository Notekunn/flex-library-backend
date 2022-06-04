import { AbstractEntity } from '@common/abstract.entity';
import { BookEntity } from '@modules/book/entities/book.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_detail')
export class OrderDetailEntity extends AbstractEntity {
  @ManyToOne(() => OrderEntity)
  order: OrderEntity;

  @ManyToOne(() => BookEntity)
  book: BookEntity;

  @Column({ default: 1 })
  quantity: number;
}
