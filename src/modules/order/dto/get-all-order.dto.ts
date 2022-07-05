import { PaginationDto } from '@common/dto/pagination.dto';
import { OrderStatus } from '@constants/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetAllOrderDto extends PaginationDto {
  @ApiProperty({
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;
}
