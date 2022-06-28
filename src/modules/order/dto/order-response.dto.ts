import { OrderStatus } from '@constants/order-status.enum';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderDetailResponseDto } from './order-detail-response.dto';
const exampleOrderDetail: OrderDetailResponseDto = {
  quantity: 1,
  book: {
    id: 1,
    author: 'Oda',
    images: [],
    name: 'One Piece',
  },
};
export class OrderResponseDto {
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    enum: OrderStatus,
  })
  status: OrderStatus;

  @ApiProperty({
    type: OrderDetailResponseDto,
    isArray: true,
    example: [exampleOrderDetail],
  })
  orderDetails: OrderDetailResponseDto[];
}
