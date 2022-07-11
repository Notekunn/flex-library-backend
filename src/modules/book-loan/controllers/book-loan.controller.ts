import { AuthUser } from '@decorators/auth-user.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReturnBookCommand } from '../commands/return-book.command';
import { ReturnBookDto } from '../dto/return-book.dto';
import { GetAllBookLoanQuery } from '../queries/get-all-book-loan.query';

@ApiTags('loans')
@Controller('loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BookLoanController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Get()
  getAll(@AuthUser() user: JwtClaimsDto) {
    return this.queryBus.execute(new GetAllBookLoanQuery(user.id));
  }

  @Post('return')
  returnBook(@AuthUser() user: JwtClaimsDto, @Body() dto: ReturnBookDto) {
    return this.commandBus.execute(new ReturnBookCommand(user.id, dto));
  }
}
