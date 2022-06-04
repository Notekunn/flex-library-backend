// import { PaginationDto } from '@common/dto/pagination.dto';
// import { UserRole } from '@constants/user-role.enum';
// import { AuthUser } from '@decorators/auth-user.decorator';
// import { Roles } from '@decorators/roles.decorator';
// import { JwtAuthGuard } from '@guards/jwt-auth.guard';
// import { RolesGuard } from '@guards/roles.guard';
// import { JwtClaimsDto } from '@modules/auth/dto/jwt-claims.dto';
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Query,
//   Param,
//   ParseIntPipe,
//   Patch,
//   Delete,
//   UseInterceptors,
//   ClassSerializerInterceptor,
//   UseGuards,
// } from '@nestjs/common';
// import { CommandBus, QueryBus } from '@nestjs/cqrs';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// // import { BookshelfAddBookCommand } from '../commands/bookshelf-add-book.command';
// import { UpdateStoreBookCommand } from '../commands/update-store-book.command';
// import { BookshelfAddBookDto } from '../dto/bookshelf-add-book.dto';
// import { UpdateStoreBookDto } from '../dto/update-store-book.dto';
// import { GetAllStoreBookQuery } from '../queries/get-all-store-book.query';

// @ApiTags('bookshelf')
// @UseInterceptors(ClassSerializerInterceptor)
// @Controller('stores/:storeId/bookshelf')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.Administrator, UserRole.Owner)
// export class BookshelfController {
//   constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

//   @Post()
//   create(
//     @AuthUser() user: JwtClaimsDto,
//     @Param('storeId', ParseIntPipe) storeId: number,
//     @Body() createStoreBookDto: BookshelfAddBookDto,
//   ) {
//     // return this.commandBus.execute(new BookshelfAddBookCommand(user.id, storeId, createStoreBookDto));
//   }

//   @Get()
//   getAll(@Query() getAllStoreBookDto: PaginationDto) {
//     return this.queryBus.execute(new GetAllStoreBookQuery(getAllStoreBookDto));
//   }

//   @Patch(':id')
//   update(@Param('id', ParseIntPipe) id: number, @Body() updateStoreBookDto: UpdateStoreBookDto) {
//     return this.commandBus.execute(new UpdateStoreBookCommand(id, updateStoreBookDto));
//   }

//   @Delete(':id')
//   delete(@Param('id', ParseIntPipe) id: number) {
//     return this.commandBus.execute(new DeleteStoreBookCommand([id]));
//   }
// }

export {};
