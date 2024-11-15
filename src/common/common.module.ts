import { Global, Module } from '@nestjs/common';
import * as winston from 'winston'
import { PrismaService } from './prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { ValidationService } from './validation/validation.service';
import { ExceptionService } from './exception/exception.service';
import { JwtService } from './jwt/jwt.service';
import { SocketService } from './socket/socket.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      // level: 'debug',
      level: 'warn',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService, ValidationService, ExceptionService, JwtService, SocketService],
  exports:[PrismaService, ValidationService, ExceptionService, JwtService, SocketService]
})

export class CommonModule {}