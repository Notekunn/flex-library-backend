import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TokenPayloadDto } from './token-payload.dto';

export class LoginResponseDto {
  @ApiProperty()
  user: UserEntity; // TODO: add user response DTO

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;
}
