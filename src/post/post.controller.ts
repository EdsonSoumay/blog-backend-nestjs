import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query} from '@nestjs/common';
import { PostService } from './post.service';
import { PostAttributes } from 'src/utils/model/post.model';

@Controller('/api/posts')
export class PostController {
  constructor(private readonly createPostService: PostService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() req: PostAttributes, 
    ): Promise<{ message: string }> {
    const userId = req?.user_id;
    await this.createPostService.createPost(req, userId);
    return {
      message: 'Successfully created post',
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getPosts(
    @Query() query: {search: string}
  ): Promise<{ message: string, data: PostAttributes | null }> {
    const {search} = query;
    const result = await this.createPostService.getPosts(search);
    return {
      message: 'Successfully got posts',
      data: result
    };
  }
}
