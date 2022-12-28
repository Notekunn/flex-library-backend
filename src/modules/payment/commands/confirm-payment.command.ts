import { GetOneUserQuery } from '@modules/user/queries/get-one-user.query';
import { Command } from '@nestjs-architects/typed-cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@shared/services/config.service';
import Stripe from 'stripe';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';

export class ConfirmPaymentCommand extends Command<ConfirmPaymentDto> {
  constructor(public readonly userId: number, public readonly dto: ConfirmPaymentDto) {
    super();
  }
}

@CommandHandler(ConfirmPaymentCommand)
export class ConfirmPaymentCommandHandler implements ICommandHandler<ConfirmPaymentCommand> {
  private stripe: Stripe;
  constructor(private readonly queryBus: QueryBus, private readonly configService: ConfigService) {
    const secretKey: string = this.configService.get('STRIPE_SK');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2022-11-15',
    });
  }
  async execute(command: ConfirmPaymentCommand): Promise<Stripe.PaymentIntent> {
    const { dto } = command;
    const paymentIntent = await this.stripe.paymentIntents.confirm(dto.paymentIntentId, {
      payment_method: dto.paymentMethod,
    });
    if (!paymentIntent) {
      throw new BadRequestException('Cannot confirm payment');
    }
    return paymentIntent;
  }
}
