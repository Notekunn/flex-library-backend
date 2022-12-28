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
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { ConfirmPaymentCommand } from '../commands/confirm-payment.command';
import { CreateCustomerCommand } from '../commands/create-customer.command';
import { CreatePaymentIntentCommand } from '../commands/create-payment-intent';
import { CreatePaymentPackageCommand } from '../commands/create-payment-package';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { CreatePaymentPackageDto } from '../dto/create-payment-package.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { GetPaymentPackagesQuery } from '../queries/get-payment-packages.query';
import { GetTransactionsQuery } from '../queries/get-transactions.query';

@ApiTags('payment')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('payment')
export class PaymentPackageController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  @Post()
  @ApiResponse({
    status: 200,
  })
  async createPayment(@AuthUser() user: JwtClaimsDto, @Body() createPaymentDto: CreatePaymentDto) {
    return this.commandBus.execute(new CreatePaymentIntentCommand(user.id, createPaymentDto));
  }

  @Get()
  @ApiResponse({
    status: 200,
  })
  async getTransactions() {
    return this.queryBus.execute(new GetTransactionsQuery(1));
  }

  @Post('/customer')
  @ApiResponse({
    status: 200,
  })
  async createCustomer(@AuthUser() user: JwtClaimsDto, @Body() createCustomerDto: Stripe.CustomerCreateParams) {
    return this.commandBus.execute(new CreateCustomerCommand(user.id, createCustomerDto));
  }

  @Post('/confirmPayment')
  @ApiResponse({
    status: 200,
  })
  async confirmPayment(@AuthUser() user: JwtClaimsDto, @Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.commandBus.execute(new ConfirmPaymentCommand(user.id, confirmPaymentDto));
  }

  @Roles(UserRole.Administrator)
  @Post('/createPaymentPackage')
  @ApiResponse({
    status: 200,
  })
  async createPaymentPackage(@Body() createPaymentPackageDto: CreatePaymentPackageDto) {
    return this.commandBus.execute(new CreatePaymentPackageCommand(createPaymentPackageDto));
  }

  @Get('/paymentPackages')
  @ApiResponse({
    status: 200,
  })
  async getPaymentPackages(@Query(new ValidationPipe({ transform: true })) getallPaymentPackageDto: PaginationDto) {
    return this.queryBus.execute(new GetPaymentPackagesQuery(getallPaymentPackageDto));
  }
}
