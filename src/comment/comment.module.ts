import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [RedisCacheModule, QueueModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
