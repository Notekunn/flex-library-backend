import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentPackageDto } from '../dto/create-payment-package.dto';
import { PaymentPackageEntity } from '../entity/payment-package.entity';
import { PaymentPackageRepository } from '../repositories/payment.repository';

export class CreatePaymentPackageCommand extends Command<CreatePaymentPackageDto> {
  constructor(public readonly dto: CreatePaymentPackageDto) {
    super();
  }
}

@CommandHandler(CreatePaymentPackageCommand)
export class CreatePaymentPackageCommandHandler implements ICommandHandler<CreatePaymentPackageCommand> {
  constructor(
    @InjectRepository(PaymentPackageEntity) private readonly paymentPackageRepository: PaymentPackageRepository,
  ) {}
  async execute(command: CreatePaymentPackageCommand): Promise<PaymentPackageEntity> {
    const { dto } = command;

    const paymentPackage = this.paymentPackageRepository.create(dto);
    return await this.paymentPackageRepository.save(paymentPackage);
  }
}
