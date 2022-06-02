import { Repository } from 'typeorm';
import { BookshelfEntity } from '../entities/bookshelf.entity';

export class BookshelfRepository extends Repository<BookshelfEntity> {}
