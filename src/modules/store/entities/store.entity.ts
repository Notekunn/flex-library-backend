import { BaseEntity } from '@common/base.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({ name: 'store' })
export class StoreEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (store) => store.id)
  ownerId: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar' })
  address: string;
  constructor(partial: Partial<StoreEntity>) {
    super();
    Object.assign(this, partial);
  }
}
