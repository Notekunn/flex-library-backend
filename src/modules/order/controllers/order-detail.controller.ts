import { AuthUser } from '@decorators/auth-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import { Body, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDetailCommand } from '../commands/create-order-detail.command';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { OrderEntity } from '../entities/order.entity';

@ApiTags('order-detail')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  @ApiResponse({
    type: OrderEntity,
    status: 200,
  })
  async createOrderDetail(@AuthUser() user: JwtClaimsDto, @Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.commandBus.execute(new CreateOrderDetailCommand(user.id, createOrderDetailDto));
  }
}