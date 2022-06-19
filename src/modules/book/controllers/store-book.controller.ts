import { PaginationDto } from '@common/dto/pagination.dto';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { GetAllBookByStoreQuery } from '../queries/get-all-book-by-store.query';

@Controller('store/:storeId/books')
@ApiTags('book')
@UseInterceptors(ClassSerializerInterceptor)
export class StoreBookController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  getAll(@Param('storeId', ParseIntPipe) storeId: number, @Query() query: PaginationDto) {
    return this.queryBus.execute(new GetAllBookByStoreQuery(storeId, query));
  }
}
