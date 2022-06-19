import { Repository } from 'typeorm';
import { BookCopyEntity } from '../entities/book-copy.entity';

export class BookCopyRepository extends Repository<BookCopyEntity> {}
