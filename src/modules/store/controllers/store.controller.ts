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
import { CreateStoreCommand } from '../commands/create-store.command';
import { DeleteStoreCommand } from '../commands/delete-store.command';
import { UpdateStoreCommand } from '../commands/update-store.command';

import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { GetAllStoreQuery } from '../queries/get-all-store.query';

@ApiTags('store')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('stores')
export class StoreController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.commandBus.execute(new CreateStoreCommand(createStoreDto));
  }
  @Get()
  async getAll(
    @Query(new ValidationPipe({ transform: true }))
    getAllStoreDto: PaginationDto,
  ) {
    return this.queryBus.execute(new GetAllStoreQuery(getAllStoreDto));
  }
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateStoreDto: UpdateStoreDto) {
    return this.commandBus.execute(new UpdateStoreCommand(id, updateStoreDto));
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteStoreCommand([id]));
  }
}
