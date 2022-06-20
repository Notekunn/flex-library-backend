import { GetAllOrderDetailQueryHandler } from './get-all-order-detail.query';
import { GetAllOrderQueryHandler } from './get-all-order.query';
import { GetOneOrderDetailHandler } from './get-one-order-detail.query';
import { GetOneOrderQueryHandler } from './get-one-order.query';
import { GetOneOrderByUserQueryHandler } from './get-order-by-user.query';

export const OrderQueryHandlers = [
  GetAllOrderQueryHandler,
  GetOneOrderQueryHandler,
  GetOneOrderDetailHandler,
  GetAllOrderDetailQueryHandler,
  GetOneOrderDetailHandler,
  GetOneOrderByUserQueryHandler,
];