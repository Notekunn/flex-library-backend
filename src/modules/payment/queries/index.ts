import { GetPaymentPackagesQueryHandler } from './get-payment-packages.query';
import { GetTransactionsQueryHandler } from './get-transactions.query';

export const PayMentQueryHandlers = [GetTransactionsQueryHandler, GetPaymentPackagesQueryHandler];
