import { AbstractEntity } from '@common/abstract.entity';
import { OrderStatus } from '@constants/order-status.enum';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderDetailEntity } from './order-detail.entity';

@Entity('order')
export class OrderEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn()
  store: StoreEntity;

  @Column({ enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[];

  @Expose()
  get totalAmount(): number {
    if (this.orderDetails) {
      return this.orderDetails.reduce((amount, orderDetail) => {
        return amount + (orderDetail.book?.rentPrice || 0) * (orderDetail.quantity || 0);
      }, 0);
    }
    return 0;
  }

  constructor(partial: Partial<OrderEntity>) {
    super();
    Object.assign(this, partial);
  }
}
