import { AbstractEntity } from '@common/abstract.entity';
import { BookStatus } from '@constants/book-status.enum';
import { BookType } from '@constants/book-type.enum';
import { BookEntity } from '@modules/book/entities/book.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('bookshelf')
export class BookshelfEntity extends AbstractEntity {
  @ManyToOne(() => BookEntity)
  book: BookEntity;

  @Column({ type: 'varchar' })
  barcode: string;

  @Column({
    enum: BookStatus,
    default: BookStatus.PENDING,
  })
  status: BookStatus;

  @Column({
    enum: BookType,
    default: BookType.UNKNOWN,
  })
  type: BookType;

  constructor(partial: Partial<BookshelfEntity>) {
    super();
    Object.assign(this, partial);
  }
}
