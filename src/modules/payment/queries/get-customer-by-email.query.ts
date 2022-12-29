import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { Query } from '@nestjs-architects/typed-cqrs';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@shared/services/config.service';
import Stripe from 'stripe';
export class GetCustomerQuery extends Query<Stripe.ApiSearchResult<Stripe.Customer>> {
  constructor(public readonly userId: number) {
    super();
  }
}

@QueryHandler(GetCustomerQuery)
export class GetCustomerQueryHandler implements IQueryHandler<GetCustomerQuery> {
  private stripe: Stripe;
  constructor(private readonly configService: ConfigService, private readonly queryBus: QueryBus) {
    const secretKey: string = this.configService.get('STRIPE_SK');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2022-11-15',
    });
  }
  async execute(query: GetCustomerQuery): Promise<Stripe.ApiSearchResult<Stripe.Customer>> {
    const { userId } = query;
    const user = await this.queryBus.execute(new GetOneUserQuery(userId));
    const { email } = user;
    const customer = await this.stripe.customers.search({
      query: `email:\"${email}\"`,
    });
    return customer;
  }
}
