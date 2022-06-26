import { AuthUser } from '@decorators/auth-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllBookLoanQuery } from './queries/get-all-book-loan.query';

@ApiTags('loans')
@Controller('loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BookLoanController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  getAll(@AuthUser() user: JwtClaimsDto) {
    return this.queryBus.execute(new GetAllBookLoanQuery(user.id));
  }
}
