import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './comment/comment.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { NotificationModule } from './notification/notification.module';
import { QueueModule } from './queue/queue.module';

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
    NotificationModule,
    QueueModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
