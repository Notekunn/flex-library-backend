import { BaseEntity } from '@common/base.entity';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { StoreBookEntity } from '@modules/store/entities/store-book.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'book' })
export class BookEntity extends BaseEntity {
  @OneToMany(() => StoreBookEntity, (storeBook) => storeBook.id)
  storeBooks: StoreBookEntity[];

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ default: false })
  imageUrl: string;

  @Column({ default: 0 })
  quantity: number;

  @OneToMany(() => CategoryEntity, (category) => category.id)
  categoryId: number;

  constructor(partial: Partial<BookEntity>) {
    super();
    Object.assign(this, partial);
  }
}
