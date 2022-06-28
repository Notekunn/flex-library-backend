import { ApiProperty } from '@nestjs/swagger';

export class StoreResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;
}
