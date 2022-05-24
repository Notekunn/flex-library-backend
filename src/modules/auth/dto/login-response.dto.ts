import { ApiProperty } from '@nestjs/swagger';
import { TokenPayloadDto } from './token-payload.dto';

export class LoginResponseDto {
  @ApiProperty()
  user: number; // TODO: add user response DTO

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;
}
