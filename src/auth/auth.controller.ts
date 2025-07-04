import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDto,
  ) {
    return this.authService.login(res, body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshTokens(req);
  }
}
