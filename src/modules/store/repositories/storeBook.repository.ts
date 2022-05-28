import { Repository } from 'typeorm';
import { StoreBookEntity } from '../entities/store-book.entity';

export class StoreBookRepository extends Repository<StoreBookEntity> {}
