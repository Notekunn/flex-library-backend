import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCoinDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly coin: number;
}
