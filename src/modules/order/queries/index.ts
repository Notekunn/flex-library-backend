import { GetAllOrderDetailQueryHandler } from './get-all-order-detail.query';
import { GetAllOrderQueryHandler } from './get-all-order.query';
import { GetOneOrderDetailQueryHandler } from './get-one-order-detail.query';
import { GetOneOrderQueryHandler } from './get-one-order.query';
import { GetOneOrderByUserQueryHandler } from './get-order-by-user.query';
import { GetOrderDetailByBookQueryHandler } from './get-order-detail-by-book';
import { ValidateOrderDetailQueryHandler } from './validate-order-detail.query';

export const OrderQueryHandlers = [GetAllOrderQueryHandler, GetOneOrderQueryHandler, GetOneOrderByUserQueryHandler];

export const OrderDetailQueryHandlers = [
  GetAllOrderDetailQueryHandler,
  GetOrderDetailByBookQueryHandler,
  GetOneOrderDetailQueryHandler,
  ValidateOrderDetailQueryHandler,
];
