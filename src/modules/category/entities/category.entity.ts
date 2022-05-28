import { BaseEntity } from '@common/base.entity';
import { Column, Entity } from 'typeorm';
@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;
  constructor(partial: Partial<CategoryEntity>) {
    super();
    Object.assign(this, partial);
  }
}
