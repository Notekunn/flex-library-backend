import { OrderStatus } from '@constants/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  @IsString()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @IsNumber()
  storeId: number;
}
