import { AbstractEntity } from '@common/abstract.entity';
import { BookEntity } from '@modules/book/entities/book.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';

@Entity('store_book')
export class StoreBookEntity extends AbstractEntity {
  @ManyToOne(() => StoreEntity, (store) => store.storeBooks)
  store: StoreEntity;

  @ManyToOne(() => BookEntity)
  book: BookEntity;

  @Column({ type: 'varchar' })
  barcode: string;

  constructor(partial: Partial<StoreBookEntity>) {
    super();
    Object.assign(this, partial);
  }
}
