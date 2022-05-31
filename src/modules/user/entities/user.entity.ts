import { AbstractEntity } from '@common/abstract.entity';
import { UserRole } from '@constants/user-role.enum';
import { StoreEntity } from '@modules/store/entities/store.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, Index } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Index()
  @Column({ type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    enum: UserRole,
    default: UserRole.Member,
  })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @OneToMany(() => StoreEntity, (store) => store.owner)
  stores: StoreEntity[];

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
