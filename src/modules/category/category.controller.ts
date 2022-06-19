import { PaginationDto } from '@common/dto/pagination.dto';
import { Roles } from '@decorators/roles.decorator';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryCommand } from './commands/create-category.command';
import { DeleteCategoryCommand } from './commands/delete-category.command';
import { UpdateCategoryCommand } from './commands/update-category.command';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetAllCategoryQuery } from './queries/get-all-category.query';
import { GetOneCategoryQuery } from './queries/get-one-category.query';

@ApiTags('category')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('category')
@ApiBearerAuth()
@UseGuards(LocalAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Get()
  getAll(@Query(new ValidationPipe({ transform: true })) getallCategoryDto: PaginationDto) {
    return this.queryBus.execute(new GetAllCategoryQuery(getallCategoryDto));
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneCategoryQuery(id));
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.commandBus.execute(new CreateCategoryCommand(createCategoryDto));
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.commandBus.execute(new UpdateCategoryCommand(id, updateCategoryDto));
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteCategoryCommand(id));
  }
}
