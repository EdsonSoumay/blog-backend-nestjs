import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';

@Module({
  controllers: [PostController],
  providers: [PostRepository]
})
export class PostModule {}
