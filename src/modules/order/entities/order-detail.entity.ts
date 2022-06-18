import { AbstractEntity } from '@common/abstract.entity';
import { BookEntity } from '@modules/book/entities/book.entity';
import { OrderEntity } from '@modules/order/entities/order.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('order-detail')
export class OrderDetailEntity extends AbstractEntity {
  @Column({ default: 0 })
  quantity: number;
  @ManyToOne(() => OrderEntity, (order) => order.id)
  order: OrderEntity;
  @ManyToOne(() => BookEntity, (book) => book.id)
  book: BookEntity;
}
