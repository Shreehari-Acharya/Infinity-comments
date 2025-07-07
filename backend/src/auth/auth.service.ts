import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async login(res: Response, body: LoginDto) {
    // get the user by email or username
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: body.usernameOrEmail },
          { username: body.usernameOrEmail },
        ],
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // verify the password
    const passwordMatches = await argon.verify(
      user.password,
      body.password,
    );
    if (!passwordMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.signTokens(
      user.id,
      user.email,
      user.username,
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { access_token };
  }

  async register(body: RegisterDto) {
    const hash = await argon.hash(body.password);

    try {
      await this.prismaService.user.create({
        data: {
          username: body.username,
          email: body.email,
          password: hash,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('email')) {
          throw new ForbiddenException('Email already in use');
        }
        if (target.includes('username')) {
          throw new ForbiddenException('Username already in use');
        }
      }
      throw error;
    }

    return {
      message: 'User registered successfully',
    };
  }

  async signTokens(
    userId: string,
    email: string,
    username: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    // Create the payload for the JWT
    const payload = {
      sub: userId,
      email: email,
      username: username,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret:
        this.config.get<string>('JWT_SECRET') || 'default-secret-key',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret:
        this.config.get<string>('JWT_SECRET') || 'default-secret-key',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(req: Request): Promise<{
    access_token: string;
  }> {
    const token = req.cookies['refresh_token'];
    if (!token) {
      throw new ForbiddenException('Refresh token not found');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret:
          this.config.get<string>('JWT_SECRET') ||
          'default-secret-key',
      });
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: payload.sub,
        email: payload.email,
        username: payload.username,
      },
      {
        expiresIn: '1h',
        secret:
          this.config.get<string>('JWT_SECRET') ||
          'default-secret-key',
      },
    );

    return {
      access_token: accessToken,
    };
  }
}
