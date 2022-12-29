import { ConfirmPaymentCommandHandler } from './confirm-payment.command';
import { CreateCustomerCommandHandler } from './create-customer.command';
import { CreatePaymentIntentCommandHandler } from './create-payment-intent';
import { CreatePaymentPackageCommandHandler } from './create-payment-package';
import { DeleteCustomerCommandHandler } from './delete-customer.command';

export const PayMentCommandHandlers = [
  CreatePaymentIntentCommandHandler,
  CreateCustomerCommandHandler,
  ConfirmPaymentCommandHandler,
  CreatePaymentPackageCommandHandler,
  DeleteCustomerCommandHandler,
];
