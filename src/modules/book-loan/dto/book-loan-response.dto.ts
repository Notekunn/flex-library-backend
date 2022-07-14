import { OrderResponseDto } from '@modules/order/dto/order-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BookLoanDetailDto {
  @ApiProperty()
  barcode: 1000;
}

export class BookLoanResponseDto {
  @ApiProperty({
    type: OrderResponseDto,
  })
  order: OrderResponseDto;

  @ApiProperty({
    type: BookLoanDetailDto,
    isArray: true,
  })
  bookLoans: BookLoanDetailDto[];
}
