import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class SocketService {
  private io: Server;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  onModuleInit() {
    const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.URL_FRONT_END,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`New client connected: ${socket.id}`);

      // Handle client joining a room
      socket.on('joinRoom', (room: string) => {
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
        socket.to(room).emit('notification', `${socket.id} has joined the room.`);
      });

      // Handle message event within a room
      socket.on('message', (data: { room: string; message: string }) => {
        console.log(`Message received in room ${data.room}: ${data.message}`);
        this.io.to(data.room).emit('response', { message: data.message });
      });

      // Handle client leaving the room
      socket.on('leaveRoom', (room: string) => {
        socket.leave(room);
        console.log(`Client ${socket.id} left room: ${room}`);
        socket.to(room).emit('notification', `${socket.id} has left the room.`);
      });

      // Handle client disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  emitEventToRoom(room: string, event: string, data: any) {
    if (!this.io) {
      console.error('Socket.IO server is not initialized.');
      return;
    }
    this.io.to(room).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    if (!this.io) {
      console.error('Socket.IO server is not initialized.');
      return;
    }
    this.io.emit(event, data); // Emit to all connected clients
  }
}
