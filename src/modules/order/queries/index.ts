import { CalculateTotalAmountQueryHandler } from './calculate-total-amount.query';
import { GetAllOrderDetailQueryHandler } from './get-all-order-detail.query';
import { GetAllOrderQueryHandler } from './get-all-order.query';
import { GetOneOrderDetailQueryHandler } from './get-one-order-detail.query';
import { GetOneOrderQueryHandler } from './get-one-order.query';
import { GetOneOrderByUserQueryHandler } from './get-order-by-user.query';
import { GetOrderDetailByBookQueryHandler } from './get-order-detail-by-book';
import { ValidateOrderDetailQueryHandler } from './validate-order-detail.query';
import { GetAllOrdersByStoreQueryHandler } from './get-all-orders-by-store.query';

export const OrderQueryHandlers = [
  GetAllOrderQueryHandler,
  GetOneOrderQueryHandler,
  GetOneOrderByUserQueryHandler,
  GetAllOrdersByStoreQueryHandler,
];

export const OrderDetailQueryHandlers = [
  GetAllOrderDetailQueryHandler,
  GetOrderDetailByBookQueryHandler,
  GetOneOrderDetailQueryHandler,
  ValidateOrderDetailQueryHandler,
  CalculateTotalAmountQueryHandler,
];
