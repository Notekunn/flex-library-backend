import { PaginationDto } from '@common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllBookDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  store?: string;

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  barcode?: string;
}
