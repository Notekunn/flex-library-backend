import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class DeleteCustomerDto {
  @ApiProperty()
  @IsString()
  customerId: string;
}
