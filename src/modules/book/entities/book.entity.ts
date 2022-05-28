import { BaseEntity } from '@common/base.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'book' })
export class BookEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  storeId: number;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  quantity: number;
  @Column()
  categoryId: number;
  constructor(partial: Partial<BookEntity>) {
    super();
    Object.assign(this, partial);
  }
}
