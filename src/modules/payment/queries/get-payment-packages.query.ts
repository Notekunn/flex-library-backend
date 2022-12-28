import { PaginationDto } from '@common/dto/pagination.dto';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { PaymentPackageEntity } from '../entity/payment-package.entity';
import { PaymentPackageRepository } from '../repositories/payment.repository';
export class GetPaymentPackagesQuery extends Query<PaymentPackageEntity[]> {
  constructor(public readonly dto: PaginationDto) {
    super();
  }
}

@QueryHandler(GetPaymentPackagesQuery)
export class GetPaymentPackagesQueryHandler implements IQueryHandler<GetPaymentPackagesQuery> {
  constructor(
    @InjectRepository(PaymentPackageEntity) private readonly paymentPackageRepository: PaymentPackageRepository,
  ) {}
  async execute(query: GetPaymentPackagesQuery): Promise<PaymentPackageEntity[]> {
    const { dto } = query;
    const paymentPackages = await this.paymentPackageRepository.find({ ...dto, order: { id: 'ASC' } });
    return paymentPackages;
  }
}
