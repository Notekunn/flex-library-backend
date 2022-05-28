import { PaginationDto } from '@common/dto/pagination.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreateBookCommand } from './commands/create-book-command';
import { DeleteBookCommand } from './commands/delete-book-command';
import { UpdateBookCommand } from './commands/update-book-command';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetAllBookQuery } from './queries/get-all-book-query';
import { GetOneBookQuery } from './queries/get-one-book-query';

@ApiTags('book')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('book')
export class BookController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.commandBus.execute(new CreateBookCommand(createBookDto));
  }
  @Get()
  getAll(@Query(new ValidationPipe({ transform: true })) getAllBookDto: PaginationDto) {
    return this.queryBus.execute(new GetAllBookQuery(getAllBookDto));
  }
  @Get('id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneBookQuery(id));
  }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.commandBus.execute(new UpdateBookCommand(id, updateBookDto));
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteBookCommand(id));
  }
}
