import { AbstractEntity } from '@common/abstract.entity';
import { CategoryEntity } from '@modules/category/entities/category.entity';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BookCopyEntity } from './book-copy.entity';

@Entity({ name: 'book' })
export class BookEntity extends AbstractEntity {
  @ManyToOne(() => StoreEntity)
  store: StoreEntity;

  @Column()
  name: string;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'simple-array' })
  images: string[];

  @Column({ type: 'int4' })
  salePrice: number;

  @Column({ type: 'int4' })
  rentPrice: number;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: 'book_category',
  })
  categories: CategoryEntity[];

  @OneToMany(() => BookCopyEntity, (bookCopy) => bookCopy.book)
  copies: BookCopyEntity[];

  @Column({ default: 0 })
  numOfCopies: number;

  constructor(partial: Partial<BookEntity>) {
    super();
    Object.assign(this, partial);
  }
}
