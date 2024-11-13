import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { PostModule } from './post/post.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, PostModule],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('api/auth/login', 'api/auth/signup')
      .forRoutes('api/*')
  }
}
