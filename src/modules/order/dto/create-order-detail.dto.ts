import { OrderDetailAction } from '@constants/order-detail-action';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsEnum(OrderDetailAction)
  @IsOptional()
  action?: OrderDetailAction;
}
