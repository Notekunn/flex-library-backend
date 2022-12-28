import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, CommandBus, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@shared/services/config.service';
import Stripe from 'stripe';
export class GetTransactionsQuery extends Query<Stripe.Response<Stripe.ApiList<Stripe.Issuing.Transaction>>> {
  constructor(public readonly userId: number) {
    super();
  }
}

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsQueryHandler implements IQueryHandler<GetTransactionsQuery> {
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
  async execute(query: GetTransactionsQuery): Promise<Stripe.Response<Stripe.ApiList<Stripe.Issuing.Transaction>>> {
    const { userId } = query;
    const transactions = await this.stripe.issuing.transactions.list({
      limit: 100,
    });
    return transactions;
  }
}
