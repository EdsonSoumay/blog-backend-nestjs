import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const urlFrontend = configService.get<string>('URL_FRONT_END') || 'http://localhost:3000';
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.enableCors({
    origin: urlFrontend, // Ganti dengan URL frontend Anda
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Metode yang diizinkan
    allowedHeaders: 'Content-Type, Authorization', // Header yang diizinkan
    credentials: true, // Untuk mengizinkan cookies dan kredensial
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
