import { PaginationDto } from '@common/dto/pagination.dto';
import { AuthUser } from '@decorators/auth-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDetailCommand } from '../commands/create-order-detail.command';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { OrderEntity } from '../entities/order.entity';
import { GetAllOrderDetailQuery } from '../queries/get-all-order-detail.query';
import { GetOneOrderDetailQuery } from '../queries/get-one-order-detail.query';

@ApiTags('order-detail')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}
  @Post()
  @ApiResponse({
    type: OrderEntity,
    status: 200,
  })
  async createOrderDetail(@AuthUser() user: JwtClaimsDto, @Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.commandBus.execute(new CreateOrderDetailCommand(user.id, createOrderDetailDto));
  }
  @Get(':id')
  async getOneOrderDetail(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetOneOrderDetailQuery(id));
  }

  @Get('')
  async getAllOrderDetails(@Query(new ValidationPipe({ transform: true })) paginationDto: PaginationDto) {
    return this.queryBus.execute(new GetAllOrderDetailQuery(paginationDto));
  }
}
