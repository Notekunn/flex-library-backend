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
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetStoreByOwnerQuery } from '../queries/get-store-by-owner.query';
import { CreateStoreCommand } from '../commands/create-store.command';
import { DeleteStoreCommand } from '../commands/delete-store.command';
import { UpdateStoreCommand } from '../commands/update-store.command';

import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { GetAllStoreQuery } from '../queries/get-all-store.query';
import { GetOneStoreQuery } from '../queries/get-one-store.query';

@ApiTags('stores')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Administrator, UserRole.Owner)
export class StoreController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  async create(@AuthUser() user: JwtClaimsDto, @Body() createStoreDto: CreateStoreDto) {
    return this.commandBus.execute(new CreateStoreCommand(user.id, createStoreDto));
  }

  @Get()
  async getAll(
    @Query()
    getAllStoreDto: PaginationDto,
  ) {
    return this.queryBus.execute(new GetAllStoreQuery(getAllStoreDto));
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneStoreQuery(id));
  }

  @Get('/user')
  async getUserStore(@AuthUser() user: JwtClaimsDto) {
    return this.queryBus.execute(new GetStoreByOwnerQuery(user.id));
  }

  @Patch(':id')
  async update(
    @AuthUser() user: JwtClaimsDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.commandBus.execute(new UpdateStoreCommand(user.id, id, updateStoreDto));
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteStoreCommand([id]));
  }
}
