import { OrderStatus } from '@constants/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;
}
