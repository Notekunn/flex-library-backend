import { AbstractEntity } from '@common/abstract.entity';
import { BookEntity } from '@modules/book/entities/book.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'store' })
export class StoreEntity extends AbstractEntity {
  @OneToOne(() => UserEntity, (user) => user.store)
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

  @OneToMany(() => BookEntity, (book) => book.store)
  books: BookEntity[];

  constructor(partial: Partial<StoreEntity>) {
    super();
    Object.assign(this, partial);
  }
}
