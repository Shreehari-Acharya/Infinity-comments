import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationGateway } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('replies')
export class QueueWorker extends WorkerHost {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationGateway,
  ) {
    super();
  }
  async process(job: Job): Promise<void> {
    const { parentId, fromUserName } = job.data;

    try {
      await this.prismaService.notification.create({
        data: {
          userId: parentId,
          content: `New reply from ${fromUserName}`,
        },
      });

      // call notification service to send notification
      this.notificationService.sendNotification(parentId, 1);
    } catch (error) {
      console.error('Error processing job:', error);
    }
  }
}
