import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, CommandBus, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@shared/services/config.service';
import Stripe from 'stripe';
import { GetCustomerQuery } from './get-customer-by-email.query';
export class GetHistoryPaymentQuery extends Query<Stripe.PaymentIntent> {
  constructor(public readonly userId: number) {
    super();
  }
}

@QueryHandler(GetHistoryPaymentQuery)
export class GetHistoryPaymentQueryHandler implements IQueryHandler<GetHistoryPaymentQuery> {
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
  async execute(query: GetHistoryPaymentQuery): Promise<Stripe.ApiList<Stripe.PaymentIntent>> {
    const { userId } = query;
    const customer = await this.queryBus.execute(new GetCustomerQuery(userId));
    const { data } = customer;
    if (!data.length || !data[0]) {
      throw new Error('Customer not found');
    }
    const historyPayment = await this.stripe.paymentIntents.list({
      customer: data[0].id,
    });
    return historyPayment;
  }
}
