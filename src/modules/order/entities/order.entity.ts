import { AbstractEntity } from '@common/abstract.entity';
import { OrderStatus } from '@constants/order-status.enum';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('order')
export class OrderEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  store: StoreEntity;

  @Column({ enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;
}
