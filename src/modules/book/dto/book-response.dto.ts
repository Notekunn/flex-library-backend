import { ApiProperty } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  author: string;

  @ApiProperty({
    isArray: true,
  })
  images: string[];
}
