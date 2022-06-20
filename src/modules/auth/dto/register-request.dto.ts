import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { LoginRequestDto } from './login-request.dto';

export class RegisterRequestDto extends LoginRequestDto {
  @IsString()
  @ApiProperty({
    example: 'Nguyen Van A',
  })
  name: string;
}
