import { AbstractEntity } from '@common/abstract.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BookshelfEntity } from './store-book.entity';

@Entity({ name: 'store' })
export class StoreEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.stores)
  owner: UserEntity;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @OneToMany(() => BookshelfEntity, (storeBook) => storeBook.book)
  bookshelfs: BookshelfEntity[];

  constructor(partial: Partial<StoreEntity>) {
    super();
    Object.assign(this, partial);
  }
}
