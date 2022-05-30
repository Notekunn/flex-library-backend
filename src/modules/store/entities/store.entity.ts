import { AbstractEntity } from '@common/abstract.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { BookshelfEntity } from './bookshelf.entity';

@Entity({ name: 'store' })
export class StoreEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.stores)
  owner: UserEntity;

  @Index()
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  provinceId?: number;

  @OneToMany(() => BookshelfEntity, (storeBook) => storeBook.book)
  bookshelfs: BookshelfEntity[];

  constructor(partial: Partial<StoreEntity>) {
    super();
    Object.assign(this, partial);
  }
}
