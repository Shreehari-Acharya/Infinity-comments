import { Injectable } from '@nestjs/common';
import { user } from 'generated/prisma';

@Injectable()
export class UserService {
  getUserProfile(user: user) {
    return { user };
  }
}
