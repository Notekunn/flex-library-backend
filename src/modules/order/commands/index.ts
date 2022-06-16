import { CreateOrderCommandHandler } from './create-order.command';
import { DeleteOrderCommandHandler } from './delete-order.command';
import { UpdateOrderCommandHandler } from './update-order.command';

export const OrderCommandHandlers = [UpdateOrderCommandHandler, CreateOrderCommandHandler, DeleteOrderCommandHandler];
