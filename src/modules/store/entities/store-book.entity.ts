import { BaseEntity } from '@common/base.entity';
import { BookEntity } from '@modules/book/entities/book.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';

@Entity('store_book')
export class StoreBookEntity extends BaseEntity {
  @ManyToOne(() => StoreEntity, (store) => store.id)
  store: StoreEntity;

  @ManyToOne(() => BookEntity, (book) => book.id)
  book: BookEntity;

  @Column({ type: 'varchar' })
  barcode: string;

  constructor(partial: Partial<StoreBookEntity>) {
    super();
    Object.assign(this, partial);
  }
}
