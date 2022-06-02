import { BookType } from '@constants/book-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, NotEquals } from 'class-validator';

export class BookshelfAddBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  barcode: string;

  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1000)
  @Max(100000000)
  salePrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(1000)
  @Max(100000000)
  rentPrice: number;

  @ApiProperty({ enum: BookType })
  @IsEnum(BookType)
  @NotEquals(BookType[BookType.UNKNOWN])
  type: BookType;
}
