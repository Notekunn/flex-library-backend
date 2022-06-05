import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100000000)
  salePrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100000000)
  rentPrice: number;

  @ApiProperty()
  categoryIds: number[];
}
