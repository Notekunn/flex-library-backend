import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

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
  @IsNumber()
  @Min(0)
  @Max(100)
  numOfCopies: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: 'array', items: { type: 'integer', example: 1 } })
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @ApiProperty()
  @IsArray({})
  images: string[];
}
