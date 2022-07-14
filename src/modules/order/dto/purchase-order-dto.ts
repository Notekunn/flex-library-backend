import { PickType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class PurchaseOrderDto extends PickType(CreateOrderDto, ['dueDate']) {}
