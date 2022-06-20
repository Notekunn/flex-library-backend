import { LocalAuthGuard } from '@guards/local-auth.guard';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTokenCommand } from './commands/create-token.command';
import { RegisterByEmailCommand } from './commands/register-by-email.command';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    type: LoginResponseDto,
    description: 'User info with access token',
    status: 200,
  })
  @ApiOperation({
    summary: 'Login to system',
  })
  async login(@Request() req) {
    const token = await this.commandBus.execute(new CreateTokenCommand(req.user));
    return {
      token,
      user: req.user,
    };
  }

  @Post('/register')
  @ApiResponse({
    type: LoginResponseDto,
    description: 'User info with access token',
    status: 200,
  })
  register(@Body() dto: RegisterRequestDto) {
    return this.commandBus.execute(new RegisterByEmailCommand(dto));
  }
}
