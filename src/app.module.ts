import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './comment/comment.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommentModule,
    RedisCacheModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
