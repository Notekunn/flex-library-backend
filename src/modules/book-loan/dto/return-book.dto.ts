import { ReturnBookType } from '@constants/return-book-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class ReturnBookDto {
  @ApiProperty({
    required: false,
    enum: ReturnBookType,
  })
  @IsEnum(ReturnBookType)
  @IsOptional()
  status?: ReturnBookType = ReturnBookType.RETURN;

  // @ApiProperty()
  // @IsString()
  // barcode: string;
}
