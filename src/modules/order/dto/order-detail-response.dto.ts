import { BookResponseDto } from '@modules/book/dto/book-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailResponseDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: BookResponseDto })
  book: BookResponseDto;
}
