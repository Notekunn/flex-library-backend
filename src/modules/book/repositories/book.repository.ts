import { Repository } from 'typeorm';
import { BookEntity } from '../entities/book.entity';

export class BookRepository extends Repository<BookEntity> {}
