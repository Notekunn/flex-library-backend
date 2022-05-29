import { AbstractEntity } from '@common/abstract.entity';
import { CategoryEntity } from '@modules/category/entities/category.entity';
import { StoreBookEntity } from '@modules/store/entities/store-book.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: 'book' })
export class BookEntity extends AbstractEntity {
  @OneToMany(() => StoreBookEntity, (storeBook) => storeBook.book)
  storeBooks: StoreBookEntity[];

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
