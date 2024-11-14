import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { UploadFileMiddleware } from './middleware/uploadFile.middleware';
import { FileController } from './file/file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CommonModule, 
    AuthModule, 
    UserModule, 
    PostModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'images'), // Ganti ke folder yang benar
      serveRoot: '/images', // Prefix untuk akses gambar
    }),
  ],
  providers: [],
  controllers: [FileController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('api/auth/login', 'api/auth/signup')
      .forRoutes('/images/*', 'api/*'); 
    
    consumer
      .apply(UploadFileMiddleware)
      .forRoutes('/api/upload'); // Apply UploadFileMiddleware
  }
}
