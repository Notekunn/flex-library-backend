import { PaginationDto } from '@common/dto/pagination.dto';
import {
  Controller,
  Get,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { GetAllBookByCategoryQuery } from '../queries/get-all-book-by-category';
import { GetAllBookQuery } from '../queries/get-all-book.query';
import { GetOneBookQuery } from '../queries/get-one-book.query';

@ApiTags('book')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('book')
export class BookController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  getAll(@Query() getAllBookDto: PaginationDto) {
    return this.queryBus.execute(new GetAllBookQuery(getAllBookDto));
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneBookQuery(id));
  }

  @Get('/category/:id')
  getAllByCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query(new ValidationPipe({ transform: true })) getAllBookDto: PaginationDto,
  ) {
    return this.queryBus.execute(new GetAllBookByCategoryQuery(id, getAllBookDto));
  }
}
