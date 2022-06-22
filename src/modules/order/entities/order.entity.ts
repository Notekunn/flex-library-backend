import { AbstractEntity } from '@common/abstract.entity';
import { OrderStatus } from '@constants/order-status.enum';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { OrderDetailEntity } from './order-detail.entity';

@Entity('order')
export class OrderEntity extends AbstractEntity {
  @OneToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  store: StoreEntity;

  @Column({ enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[];
}
