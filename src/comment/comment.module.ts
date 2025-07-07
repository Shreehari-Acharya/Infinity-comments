import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
