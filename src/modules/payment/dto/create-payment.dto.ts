import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import Stripe from 'stripe';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  currency: string;
  // customer?: string;
  // description?: string;
  // payment_method?: string;
  // payment_method_types?: Array<string>;

  // constructor(partial: Partial<CreatePaymentDto> = {}) {
  //   Object.assign(this, partial);
  // }
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  payment_method_types: Array<string>;
}
