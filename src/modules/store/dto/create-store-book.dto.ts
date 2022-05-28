import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStoreBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  storeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  barcode: string;
}
