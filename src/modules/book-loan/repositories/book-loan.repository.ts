import { Repository } from 'typeorm';
import { BookLoanEntity } from '../entities/book-loan.entity';

export class BookLoanRepository extends Repository<BookLoanEntity> {}
