import { Repository } from 'typeorm';
import { BookshelfEntity } from '../entities/bookshelf.entity';

export class StoreBookRepository extends Repository<BookshelfEntity> {}
