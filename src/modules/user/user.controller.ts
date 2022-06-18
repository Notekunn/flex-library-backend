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
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllUserQuery } from './queries/get-all-user.query';
import { PaginationDto } from '@common/dto/pagination.dto';
import { GetOneUserQuery } from './queries/get-one-user.query';
import { UpdateUserCommand } from './commands/update-user.command';
import { DeleteUserCommand } from './commands/delete-user.command';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { Roles } from '@decorators/roles.decorator';
import { UserRole } from '@constants/user-role.enum';
import { RolesGuard } from '@guards/roles.guard';

@Controller('user')
@ApiTags('user')
@UseInterceptors(ClassSerializerInterceptor)
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  // @Roles(UserRole.Administrator)
  create(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  @Roles(UserRole.Administrator)
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    getAllUserDto: PaginationDto,
  ) {
    return this.queryBus.execute(new GetAllUserQuery(getAllUserDto));
  }

  @Get('me')
  whoAmI(@Request() req) {
    return this.queryBus.execute(new GetOneUserQuery(req.user.id));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneUserQuery(id));
  }

  @Patch(':id')
  @Roles(UserRole.Administrator)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Delete(':id')
  @Roles(UserRole.Administrator)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteUserCommand([id]));
  }
}
