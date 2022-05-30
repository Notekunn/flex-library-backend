import { AbstractEntity } from '@common/abstract.entity';
import { BookEntity } from '@modules/book/entities/book.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';

@Entity('bookshelf')
export class BookshelfEntity extends AbstractEntity {
  @ManyToOne(() => StoreEntity, (store) => store.bookshelfs)
  store: StoreEntity;

  @ManyToOne(() => BookEntity)
  book: BookEntity;

  @Column({ type: 'varchar' })
  barcode: string;

  constructor(partial: Partial<BookshelfEntity>) {
    super();
    Object.assign(this, partial);
  }
}
