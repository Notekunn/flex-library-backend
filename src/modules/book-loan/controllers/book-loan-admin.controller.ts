import { UserRole } from '@constants/user-role.enum';
import { AuthUser } from '@decorators/auth-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import { CancelOrderCommand } from '@modules/order/commands/cancel-order-command';
import { ConfirmOrderCommand } from '@modules/order/commands/confirm-order-command';
import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetBookLoanByOrderQuery } from '../queries/get-book-loan-by-order';

@ApiTags('loans')
@ApiBearerAuth()
@Controller('order/:orderId/loans')
@Roles(UserRole.Administrator, UserRole.Owner, UserRole.Staff)
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookLoanAdminController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Get()
  getAll(@Param('orderId', ParseIntPipe) orderId: number, @AuthUser() user: JwtClaimsDto) {
    return this.queryBus.execute(new GetBookLoanByOrderQuery(user.id, orderId));
  }

  @Post()
  update(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.commandBus.execute(new ConfirmOrderCommand(orderId));
  }

  @Delete()
  remove(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.commandBus.execute(new CancelOrderCommand(orderId));
  }
}
