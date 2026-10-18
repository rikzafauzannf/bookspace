import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma.service';
import { UseGuards } from '@nestjs/common';
import { SendMessageInput } from '@app/common';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    // In production: extract token from handshake, verify JWT, set user
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('transactionId') transactionId: string,
  ) {
    client.join(`trx_${transactionId}`);

    // Fetch and return chat history
    const messages = await this.prisma.chatMessage.findMany({
      where: { transactionId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, fullName: true, avatarUrl: true } } },
    });

    client.emit('chatHistory', messages);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { transactionId: string; senderId: string; content: string },
  ) {
    const { transactionId, senderId, content } = payload;

    // Verify transaction exists and is at least APPROVED (private contact rule)
    const trx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!trx || trx.status === 'REQUESTED' || trx.status === 'REJECTED' || trx.status === 'CANCELLED') {
      return client.emit('error', 'Chat is only allowed for approved transactions');
    }

    if (trx.initiatorId !== senderId && trx.ownerId !== senderId) {
      return client.emit('error', 'Access denied to this chat room');
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        transactionId,
        senderId,
        content,
      },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    // Broadcast to room
    this.server.to(`trx_${transactionId}`).emit('newMessage', message);
  }
}
