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
import { AuthUser } from '@decorators/auth-user.decorator';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';

@Controller('user')
@ApiTags('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  @Roles(UserRole.Administrator)
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
  whoAmI(@AuthUser() user: JwtClaimsDto) {
    return this.queryBus.execute(new GetOneUserQuery(user.id));
  }

  @Post('me')
  updateProfile(@AuthUser() user: JwtClaimsDto, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(user.id, updateUserDto));
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
