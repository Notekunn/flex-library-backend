import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePageOptionsDto } from './base-page-options.dto';

export class PaginationDto extends BasePageOptionsDto {
  @ApiProperty({ example: ['id:asc'] })
  @IsString({ each: true })
  @IsOptional()
  readonly sort?: string[];
}
