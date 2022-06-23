import { CreateOrderDetailCommandHandler } from './create-order-detail.command';
import { CreateOrderCommandHandler } from './create-order.command';
import { DeleteOrderDetailCommandHandler } from './delete-order-detail.command';
import { DeleteOrderCommandHandler } from './delete-order.command';
import { PurchaseOrderCommandHandler } from './purchase-order.command';
import { UpdateOrderDetailCommandHandler } from './update-order-detail.command';
import { UpdateOrderCommandHandler } from './update-order.command';

export const OrderCommandHandlers = [
  UpdateOrderCommandHandler,
  UpdateOrderDetailCommandHandler,
  CreateOrderCommandHandler,
  CreateOrderDetailCommandHandler,
  DeleteOrderCommandHandler,
  DeleteOrderDetailCommandHandler,
  PurchaseOrderCommandHandler,
];
