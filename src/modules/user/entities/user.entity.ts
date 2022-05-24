import { BaseEntity } from '@common/base.entity';
import { UserRole } from '@constants/user-role.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  email: string;

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

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
