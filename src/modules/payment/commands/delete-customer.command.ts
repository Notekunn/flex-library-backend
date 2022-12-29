import { Command } from '@nestjs-architects/typed-cqrs';
import { ICommandHandler, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@shared/services/config.service';
import Stripe from 'stripe';

export class DeleteCustomerCommand extends Command<Stripe.Customer> {
  constructor(public readonly customerId: string) {
    super();
  }
}

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerCommandHandler implements ICommandHandler<DeleteCustomerCommand> {
  private stripe: Stripe;
  constructor(private readonly queryBus: QueryBus, private readonly configService: ConfigService) {
    const secretKey: string = this.configService.get('STRIPE_SK');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2022-11-15',
    });
  }
  async execute(command: DeleteCustomerCommand): Promise<Stripe.DeletedCustomer> {
    const { customerId } = command;

    const customer = await this.stripe.customers.del(customerId);
    return customer;
  }
}
