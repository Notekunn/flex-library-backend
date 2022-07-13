import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatarURL?: string;
}
