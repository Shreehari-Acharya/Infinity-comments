import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway(3001, { cors: true })
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  async handleConnection(client: Socket) {
    const token = this.extractTokenFromSocket(client);
    if (!token) {
      console.error('No token found in socket connection');
      client.disconnect();
      return;
    }

    let userId: string;
    try {
      const payload = this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('JWT_SECRET') ||
          'default-secret-key',
      });
      userId = payload.sub;
    } catch (error) {
      console.error('Invalid token:', error);
      client.disconnect();
      return;
    }

    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} connected via WS`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        client.disconnect();
        break;
      }
    }
  }

  private extractTokenFromSocket(client: Socket): string {
    // Extract token from Authorization header
    const authHeader = client.handshake.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    throw new Error('No token found');
  }

  sendNotification(userId: string, notification: number) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }
}
