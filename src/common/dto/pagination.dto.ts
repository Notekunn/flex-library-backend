import { BaseEntity } from '@common/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UtilsService } from '@providers/utils.service';
import { IsOptional, IsString } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';
import { BasePageOptionsDto } from './base-page-options.dto';

export class PaginationDto extends BasePageOptionsDto {
  @ApiProperty({ example: ['id:asc'] })
  @IsString({ each: true })
  @IsOptional()
  readonly sort?: string[];

  public toQueryOrder<T extends BaseEntity>(): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};
    if (this.sort) {
      const sortArray = Array.isArray(this.sort) ? this.sort : [this.sort];
      for (const sortItem of sortArray) {
        const [field, sortType] = sortItem.split(':');
        if (field) {
          order[field] = UtilsService.nomalizeSortType(sortType);
        }
      }
    }
    return order;
  }
}
