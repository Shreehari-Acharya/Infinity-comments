import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'isAuthenticated',
) {
  constructor(
    config: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('JWT_SECRET') || 'default-secret-key',
    });
  }

  async validate(payload: {
    sub: string;
    username: string;
    email: string;
  }) {
    console.log('gaurd hit')
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
