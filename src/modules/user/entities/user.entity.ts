import { AbstractEntity } from '@common/abstract.entity';
import { UserRole } from '@constants/user-role.enum';
import { OrderEntity } from '@modules/order/entities/order.entity';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Index()
  @Column({ type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    enum: UserRole,
    default: UserRole.Member,
  })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @OneToOne(() => StoreEntity, (store) => store.owner, { nullable: true })
  store: StoreEntity | null;

  @OneToMany(() => OrderEntity, (order) => order.owner)
  orders: OrderEntity[];

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
