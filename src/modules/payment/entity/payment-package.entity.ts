import { AbstractEntity } from '@common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'payment-package' })
export class PaymentPackageEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  coin: number;

  @Column()
  imageUrl: string;

  constructor(partial: Partial<PaymentPackageEntity>) {
    super();
    Object.assign(this, partial);
  }
}
