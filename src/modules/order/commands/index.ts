import { CancelOrderCommandHandler } from './cancel-order-command';
import { ConfirmOrderCommandHandler } from './confirm-order-command';
import { CreateOrderDetailCommandHandler } from './create-order-detail.command';
import { CreateOrderCommandHandler } from './create-order.command';
import { DeleteOrderDetailCommandHandler } from './delete-order-detail.command';
import { DeleteOrderCommandHandler } from './delete-order.command';
import { GetNewQuantityCommandHandler } from './get-new-quantity.command';
import { PurchaseOrderCommandHandler } from './purchase-order.command';
import { UpdateOrderDetailCommandHandler } from './update-order-detail.command';
import { UpdateOrderCommandHandler } from './update-order.command';

export const OrderCommandHandlers = [
  UpdateOrderCommandHandler,
  CreateOrderCommandHandler,
  DeleteOrderCommandHandler,
  PurchaseOrderCommandHandler,
  GetNewQuantityCommandHandler,
  ConfirmOrderCommandHandler,
  CancelOrderCommandHandler,
];

export const OrderDetailCommandHandlers = [
  CreateOrderDetailCommandHandler,
  UpdateOrderDetailCommandHandler,
  DeleteOrderDetailCommandHandler,
];
