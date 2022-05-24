import { LocalAuthGuard } from '@guards/local-auth.guard';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTokenCommand } from './commands/create-token.command';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

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
}
