import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @ApiProperty({ example: 'admin@gmail.com' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: 'password' })
  readonly password: string;
}
