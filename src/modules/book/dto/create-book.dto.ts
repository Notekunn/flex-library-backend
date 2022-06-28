import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @Min(0)
  @IsNumber()
  numOfCopies: number;

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
  @IsOptional()
  @IsString()
  author: string;

  @ApiProperty({ type: 'array', items: { type: 'integer', example: 1 } })
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @ApiProperty()
  @IsUrl({}, { each: true })
  images: string[];
}
