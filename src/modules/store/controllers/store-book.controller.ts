import { PaginationDto } from '@common/dto/pagination.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreateStoreBookCommand } from '../commands/create-store-book-command';
import { DeleteStoreBookCommand } from '../commands/delete-store-book-command';
import { UpdateStoreBookCommand } from '../commands/update-store-book-commnad';
import { CreateStoreBookDto } from '../dto/create-store-book.dto';
import { UpdateStoreBookDto } from '../dto/update-store-book.dto';
import { GetAllStoreBookQuery } from '../queries/get-all-store-book-query';

@ApiTags('store-book')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('store-book')
export class StoreBookController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  @Post()
  create(@Body() createStoreBookDto: CreateStoreBookDto) {
    return this.commandBus.execute(new CreateStoreBookCommand(createStoreBookDto));
  }

  @Get()
  getAll(@Query(new ValidationPipe({ transform: true })) getAllStoreBookDto: PaginationDto) {
    return this.queryBus.execute(new GetAllStoreBookQuery(getAllStoreBookDto));
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStoreBookDto: UpdateStoreBookDto) {
    return this.commandBus.execute(new UpdateStoreBookCommand(id, updateStoreBookDto));
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteStoreBookCommand([id]));
  }
}
