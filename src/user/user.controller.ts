import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.decorator';
import { user } from 'generated/prisma';
import { JwtGuard } from 'src/auth/gaurd';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  getUserProfile(@User() user: user) {
    return this.userService.getUserProfile(user);
  }
}
