import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  findAll() {
    // return this.authService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   // return this.authService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   // return this.authService.remove(+id);
  // }

  @Post('/login')
  @ApiResponse({
    type: LoginResponseDto,
    description: 'User info with access token',
    status: 200,
  })
  @ApiOperation({
    summary: 'Login to system',
  })
  login() {
    return 'login';
  }
}
