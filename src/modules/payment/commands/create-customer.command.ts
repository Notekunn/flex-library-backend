import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@shared/services/config.service';
import Stripe from 'stripe';
import { GetCustomerQuery } from '../queries/get-customer-by-email.query';

export class CreateCustomerCommand extends Command<Stripe.Customer> {
  constructor(public readonly userId: number) {
    super();
  }
}

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerCommandHandler implements ICommandHandler<CreateCustomerCommand> {
  private stripe: Stripe;
  constructor(private readonly queryBus: QueryBus, private readonly configService: ConfigService) {
    const secretKey: string = this.configService.get('STRIPE_SK');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2022-11-15',
    });
  }
  async execute(command: CreateCustomerCommand): Promise<Stripe.Customer> {
    const { userId } = command;
    const user = await this.queryBus.execute(new GetOneUserQuery(userId));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const customer = await this.queryBus.execute(new GetCustomerQuery(userId));
    if (customer.data.length) {
      throw new BadRequestException('Customer already exists');
    }

    const { email, name } = user;
    const newCustomer = await this.stripe.customers.create({
      email,
      name,
    });
    if (!newCustomer) {
      throw new BadRequestException('Cannot create customer');
    }
    return newCustomer;
  }
}
