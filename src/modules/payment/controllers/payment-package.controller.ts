import { PaginationDto } from '@common/dto/pagination.dto';
import { UserRole } from '@constants/user-role.enum';
import { AuthUser } from '@decorators/auth-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConfirmPaymentCommand } from '../commands/confirm-payment.command';
import { CreateCustomerCommand } from '../commands/create-customer.command';
import { CreatePaymentIntentCommand } from '../commands/create-payment-intent';
import { CreatePaymentPackageCommand } from '../commands/create-payment-package';
import { DeleteCustomerCommand } from '../commands/delete-customer.command';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { CreatePaymentPackageDto } from '../dto/create-payment-package.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { DeleteCustomerDto } from '../dto/delete-customer.dto';
import { GetCustomerQuery } from '../queries/get-customer-by-email.query';
import { GetPaymentPackagesQuery } from '../queries/get-payment-packages.query';
import { GetHistoryPaymentQuery } from '../queries/get-history-payment-customer.query';

@ApiTags('payment')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('payment')
export class PaymentPackageController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  @Post()
  async createPayment(@AuthUser() user: JwtClaimsDto, @Body() createPaymentDto: CreatePaymentDto) {
    return this.commandBus.execute(new CreatePaymentIntentCommand(user.id, createPaymentDto));
  }

  @Get()
  async getHistoryPayment(@AuthUser() user: JwtClaimsDto) {
    return this.queryBus.execute(new GetHistoryPaymentQuery(user.id));
  }

  @Post('/customer')
  async createCustomer(@AuthUser() user: JwtClaimsDto) {
    return this.commandBus.execute(new CreateCustomerCommand(user.id));
  }

  @Get('/customer')
  async getCustomer(@AuthUser() user: JwtClaimsDto) {
    return this.queryBus.execute(new GetCustomerQuery(user.id));
  }

  @Delete('/customer')
  async deleteCustomer(@Body() dto: DeleteCustomerDto) {
    return this.commandBus.execute(new DeleteCustomerCommand(dto.customerId));
  }

  @Post('/confirm-payment')
  async confirmPayment(@AuthUser() user: JwtClaimsDto, @Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.commandBus.execute(new ConfirmPaymentCommand(user.id, confirmPaymentDto));
  }

  @Roles(UserRole.Administrator)
  @Post('/payment-package')
  async createPaymentPackage(@Body() createPaymentPackageDto: CreatePaymentPackageDto) {
    return this.commandBus.execute(new CreatePaymentPackageCommand(createPaymentPackageDto));
  }

  @Get('/payment-package')
  async getPaymentPackages(@Query(new ValidationPipe({ transform: true })) getallPaymentPackageDto: PaginationDto) {
    return this.queryBus.execute(new GetPaymentPackagesQuery(getallPaymentPackageDto));
  }
}
