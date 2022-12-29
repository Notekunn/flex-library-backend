import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
