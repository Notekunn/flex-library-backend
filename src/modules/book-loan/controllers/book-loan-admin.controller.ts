import { OrderStatus } from '@constants/order-status.enum';
import { UserRole } from '@constants/user-role.enum';
import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { UpdateOrderCommand } from '@modules/order/commands/update-order.command';
import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetBookLoanByOrderQuery } from '../queries/get-book-loan-by-order';

@ApiTags('loans')
@ApiBearerAuth()
@Controller('order/:orderId/loans')
@Roles(UserRole.Administrator)
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookLoanAdminController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Get()
  getAll(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.queryBus.execute(new GetBookLoanByOrderQuery(orderId));
  }

  @Post()
  update(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.commandBus.execute(
      new UpdateOrderCommand(orderId, {
        status: OrderStatus.COMPLETED,
      }),
    );
  }

  @Delete()
  remove(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.commandBus.execute(
      new UpdateOrderCommand(orderId, {
        status: OrderStatus.CANCELLED,
      }),
    );
  }
}
