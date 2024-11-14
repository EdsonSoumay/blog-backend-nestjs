import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Put, Param} from '@nestjs/common';
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
    await this.createPostService.createPostService(req, userId);
    return {
      message: 'Successfully created post',
    };
  }

  @Put('/:id')
  @HttpCode(HttpStatus.CREATED)
  async editPost(
    @Param('id') id: string,
    @Body() req: PostAttributes, 
    ): Promise<{ message: string }> {
    const userId = req?.user_id;
    const postId = parseInt(id)
    await this.createPostService.editPostService(req, postId);
    return {
      message: 'Successfully update post',
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getPosts(
    @Query() query: {search: string}
  ): Promise<{ message: string, data: PostAttributes | null }> {
    const {search} = query;
    const result = await this.createPostService.getPostsService(search);
    return {
      message: 'Successfully got posts',
      data: result
    };
  }
}
