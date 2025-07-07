import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueWorker } from './queue.worker';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    NotificationModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'replies',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [QueueService, QueueWorker],
  exports: [QueueService, QueueWorker],
})
export class QueueModule {}
