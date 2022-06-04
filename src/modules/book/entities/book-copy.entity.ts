import { AbstractEntity } from '@common/abstract.entity';
import { BookStatus } from '@constants/book-status.enum';
import { BookType } from '@constants/book-type.enum';
import { BookLoanEntity } from '@modules/book-loan/entities/book-loan.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BookEntity } from './book.entity';

@Entity('book_copy')
export class BookCopyEntity extends AbstractEntity {
  @ManyToOne(() => BookEntity, (book) => book.copies)
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

  @OneToMany(() => BookLoanEntity, (bookLoan) => bookLoan.bookCopy)
  loans: BookLoanEntity[];
}
