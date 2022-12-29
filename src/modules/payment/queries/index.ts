import { GetCustomerQueryHandler } from './get-customer-by-email.query';
import { GetPaymentPackagesQueryHandler } from './get-payment-packages.query';
import { GetHistoryPaymentQueryHandler } from './get-history-payment-customer.query';

export const PayMentQueryHandlers = [
  GetHistoryPaymentQueryHandler,
  GetPaymentPackagesQueryHandler,
  GetCustomerQueryHandler,
];
