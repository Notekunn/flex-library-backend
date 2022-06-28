import { PaginationDto } from '@common/dto/pagination.dto';
import { UserRole } from '@constants/user-role.enum';
import { AuthUser } from '@decorators/auth-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
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
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBookCommand } from '../commands/create-book.command';
import { DeleteBookCommand } from '../commands/delete-book.command';
import { UpdateBookCommand } from '../commands/update-book.command';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { GetAllBookByCategoryQuery } from '../queries/get-all-book-by-category';
import { GetAllBookQuery } from '../queries/get-all-book.query';
import { GetOneBookQuery } from '../queries/get-one-book.query';

@ApiTags('book')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('book')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Roles(UserRole.Owner, UserRole.Administrator)
  @Post()
  create(@AuthUser() user: JwtClaimsDto, @Body() createBookDto: CreateBookDto) {
    return this.commandBus.execute(new CreateBookCommand(user.id, createBookDto));
  }

  @Get()
  getAll(@Query(new ValidationPipe({ transform: true })) getAllBookDto: PaginationDto) {
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

  @Roles(UserRole.Owner, UserRole.Administrator)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.commandBus.execute(new UpdateBookCommand(id, updateBookDto));
  }

  @Roles(UserRole.Owner, UserRole.Administrator)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteBookCommand(id));
  }
}
