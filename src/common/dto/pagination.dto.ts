import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BasePageOptionsDto } from './base-page-options.dto';

export class PaginationDto extends BasePageOptionsDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  readonly sort?: string | string[];
}
