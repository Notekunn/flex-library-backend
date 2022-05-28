import { BaseEntity } from '@common/base.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { StoreBookEntity } from './store-book.entity';

@Entity({ name: 'store' })
export class StoreEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (store) => store.id)
  owner: UserEntity;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @OneToMany(() => StoreBookEntity, (storeBook) => storeBook.id)
  storeBooks: StoreBookEntity[];

  constructor(partial: Partial<StoreEntity>) {
    super();
    Object.assign(this, partial);
  }
}
