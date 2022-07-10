import { BookEntity } from './book.entity';

export class BookWithCountEntity extends BookEntity {
  rentCount: number;
}
