import { UserRole } from '@constants/user-role.enum';
import { AuthUser } from '@decorators/auth-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBookCopyCommand } from '../commands/create-book-copy.command';
import { CreateBookCopyDto } from '../dto/create-book-copy.dto';
import { GetAllBookCopyDto } from '../dto/get-all-book-copy.dto';
import { GetAllBookCopyQuery } from '../queries/get-all-book-copy.query';

@Controller('book/:bookId/copies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Administrator, UserRole.Owner)
@ApiTags('book')
@ApiBearerAuth()
export class BookCopyController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  @Get()
  getAll(@Param('bookId', ParseIntPipe) bookId: number, @Query() dto: GetAllBookCopyDto) {
    return this.queryBus.execute(new GetAllBookCopyQuery(bookId, dto));
  }

  @Post()
  create(
    @AuthUser() user: JwtClaimsDto,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() dto: CreateBookCopyDto,
  ) {
    return this.commandBus.execute(new CreateBookCopyCommand(user.id, bookId, dto));
  }
}
