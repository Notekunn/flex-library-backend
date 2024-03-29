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
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteOrderCommand } from '../commands/delete-order.command';
import { PurchaseOrderCommand } from '../commands/purchase-order.command';
import { UpdateOrderCommand } from '../commands/update-order.command';
import { GetAllOrderDto } from '../dto/get-all-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { PurchaseOrderDto } from '../dto/purchase-order-dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { GetAllOrderQuery } from '../queries/get-all-order.query';
import { GetAllOrdersByStoreQuery } from '../queries/get-all-orders-by-store.query';
import { GetOneOrderQuery } from '../queries/get-one-order.query';

@ApiTags('order')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Get()
  @ApiResponse({
    type: OrderResponseDto,
    isArray: true,
    status: 200,
  })
  async getAllOrders(@AuthUser() user: JwtClaimsDto, @Query() paginationDto: GetAllOrderDto) {
    return this.queryBus.execute(new GetAllOrderQuery(user.id, paginationDto));
  }

  @Post(':id/purchase')
  async purchaseOrder(
    @AuthUser() user: JwtClaimsDto,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: PurchaseOrderDto,
  ) {
    return this.commandBus.execute(new PurchaseOrderCommand(user.id, orderId, dto));
  }

  @Get('/store')
  @ApiResponse({
    type: OrderResponseDto,
    isArray: true,
    status: 200,
  })
  async getAllOrdersByStore(@AuthUser() user: JwtClaimsDto, @Query() paginationDto: GetAllOrderDto) {
    return this.queryBus.execute(new GetAllOrdersByStoreQuery(user.id, paginationDto));
  }
  @Get(':id')
  @ApiResponse({
    type: OrderResponseDto,
    status: 200,
  })
  async getOneOrder(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneOrderQuery(id));
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
