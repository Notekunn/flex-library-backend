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
import { CreateOrderDetailCommand } from '../commands/create-order-detail.command';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';

@ApiTags('order')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}
  @Post('')
  async createOrderDetail(@AuthUser() user: JwtClaimsDto, @Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.commandBus.execute(new CreateOrderDetailCommand(user.id, createOrderDetailDto));
  }
}
