import { PaginationDto } from '@common/dto/pagination.dto';
import { AuthUser } from '@decorators/auth-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderCommand } from '../commands/create-order.command';
import { DeleteOrderCommand } from '../commands/delete-order.command';
import { UpdateOrderCommand } from '../commands/update-order.command';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { GetAllOrderQuery } from '../queries/get-all-order.query';
import { GetOneOrderQuery } from '../queries/get-one-order.query';

@ApiTags('order')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Post('')
  async createOrder(@AuthUser() user: JwtClaimsDto, @Body() createOrderDto: CreateOrderDto) {
    return this.commandBus.execute(new CreateOrderCommand(user.id, createOrderDto));
  }

  @Get(':id')
  async getOneOrder(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneOrderQuery(id));
  }

  @Get('')
  async getAllOrders(@Query(new ValidationPipe({ transform: true })) paginationDto: PaginationDto) {
    return this.queryBus.execute(new GetAllOrderQuery(paginationDto));
  }

  @Patch(':id')
  async updateOrder(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.commandBus.execute(new UpdateOrderCommand(id, updateOrderDto));
  }

  @Delete(':id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteOrderCommand([id]));
  }
}