import { ConfirmPaymentCommandHandler } from './confirm-payment.command';
import { CreateCustomerCommandHandler } from './create-customer.command';
import { CreatePaymentIntentCommandHandler } from './create-payment-intent';
import { CreatePaymentPackageCommandHandler } from './create-payment-package';

export const PayMentCommandHandlers = [
  CreatePaymentIntentCommandHandler,
  CreateCustomerCommandHandler,
  ConfirmPaymentCommandHandler,
  CreatePaymentPackageCommandHandler,
];
