import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('replies') private repliesQueue: Queue) {}

  async addReplyToQueue(parentId: string, fromUserName: string) {
    try {
      await this.repliesQueue.add(
        'reply',
        {
          parentId,
          fromUserName,
        },
        {
          removeOnComplete: true,
          attempts: 3,
        },
      );
    } catch (error) {
      console.error('Error adding reply to queue:', error);
      throw new Error('Failed to add reply to queue');
    }
  }
}
