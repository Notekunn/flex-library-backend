import { Repository } from 'typeorm';
import { BookshelfEntity } from '../entities/store-book.entity';

export class StoreBookRepository extends Repository<BookshelfEntity> {}
