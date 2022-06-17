import { UserRole } from '@constants/user-role.enum';
import { AuthUser } from '@decorators/auth-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBookCopyCommand } from '../commands/create-book-copy.command';
import { CreateBookCopyDto } from '../dto/create-book-copy.dto';

@Controller('book/:bookId/copies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Administrator, UserRole.Owner)
@ApiTags('book')
@ApiBearerAuth()
export class BookCopyController {
  constructor(private readonly commandBus: CommandBus) {}
  @Get()
  getAll(@Param('bookId', ParseIntPipe) bookId: number) {
    return bookId;
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
