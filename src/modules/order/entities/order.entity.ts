import { AbstractEntity } from '@common/abstract.entity';
import { OrderStatus } from '@constants/order-status.enum';
import { BookLoanEntity } from '@modules/book-loan/entities/book-loan.entity';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('order')
export class OrderEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.orders)
  owner: UserEntity;

  @ManyToOne(() => StoreEntity, (store) => store.orders)
  store: StoreEntity;

  @Column({ enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @OneToMany(() => BookLoanEntity, (bookLoan) => bookLoan.order)
  loans: BookLoanEntity[];
}
