import { AbstractEntity } from '@common/abstract.entity';
import { CategoryEntity } from '@modules/category/entities/category.entity';
import { BookshelfEntity } from '@modules/store/entities/bookshelf.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: 'book' })
export class BookEntity extends AbstractEntity {
  @OneToMany(() => BookshelfEntity, (storeBook) => storeBook.book)
  storeBooks: BookshelfEntity[];

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ default: false })
  imageUrl: string;

  @Column({ default: 0 })
  quantity: number;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: 'book_category',
  })
  category: CategoryEntity;

  constructor(partial: Partial<BookEntity>) {
    super();
    Object.assign(this, partial);
  }
}
