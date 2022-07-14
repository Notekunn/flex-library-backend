import { AbstractEntity } from '@common/abstract.entity';
import { BookLoanStatus } from '@constants/book-loan-status.enum';
import { BookEntity } from '@modules/book/entities/book.entity';
import { OrderEntity } from '@modules/order/entities/order.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('book_loan')
export class BookLoanEntity extends AbstractEntity {
  @ManyToOne(() => OrderEntity)
  order: OrderEntity;

  @ManyToOne(() => BookEntity)
  book: BookEntity;

  @Column({ enum: BookLoanStatus, default: BookLoanStatus.RENTING })
  status: BookLoanStatus;

  @Column({ type: 'timestamptz' })
  dueDate: Date;
}
