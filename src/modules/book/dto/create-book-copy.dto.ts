import { BookType } from '@constants/book-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, NotEquals } from 'class-validator';

export class CreateBookCopyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  barcode: string;

  @ApiProperty({ enum: BookType })
  @IsEnum(BookType)
  @NotEquals(BookType[BookType.UNKNOWN])
  type: BookType;
}
