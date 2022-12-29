import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler, CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@shared/services/config.service';
import Stripe from 'stripe';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { GetCustomerQuery } from '../queries/get-customer-by-email.query';
import { CreateCustomerCommand } from './create-customer.command';

export class CreatePaymentIntentCommand extends Command<CreatePaymentDto> {
  constructor(public readonly userId: number, public readonly dto: CreatePaymentDto) {
    super();
  }
}

@CommandHandler(CreatePaymentIntentCommand)
export class CreatePaymentIntentCommandHandler
  implements ICommandHandler<CreatePaymentIntentCommand, CreatePaymentDto>
{
  private stripe: Stripe;
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {
    const secretKey: string = this.configService.get('STRIPE_SK');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2022-11-15',
    });
  }
  async execute(command: CreatePaymentIntentCommand): Promise<Stripe.PaymentIntent> {
    const { dto, userId } = command;
    const customer = await this.queryBus.execute(new GetCustomerQuery(userId));
    if (!customer.data.length || !customer.data[0]) {
      const newCustomer = await this.commandBus.execute(new CreateCustomerCommand(userId));
      const { amount, currency, payment_method_types } = dto;
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types,
        customer: newCustomer.id,
      });
      return paymentIntent;
    }
    const { amount, currency, payment_method_types } = dto;
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types,
      customer: customer.data[0].id,
    });
    return paymentIntent;
  }
}
