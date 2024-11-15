import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Put, Param, Delete} from '@nestjs/common';
import { PostService } from './post.service';
import { PostAttributes } from 'src/utils/model/post.model';

@Controller('/api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() req: PostAttributes, 
    ): Promise<{ message: string }> {
    const userId = req?.user_id;
    await this.postService.createPostService(req, userId);
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
    await this.postService.editPostService(req, postId, userId);
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
    const result = await this.postService.getPostsService(search);
    return {
      message: 'Successfully get posts',
      data: result
    };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getPost(
    @Param('id') id: string,
  ): Promise<{ message: string, data: PostAttributes | null }> {
    const postId = parseInt(id)
    const result = await this.postService.getPostService(postId);
    return {
      message: 'Successfully get post',
      data: result
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param('id') id: string,
    @Body() req: PostAttributes, 
  ): Promise<{ message: string }> {
    const postId = parseInt(id)
    const userId = req?.user_id;
    await this.postService.deletePostService(postId, userId);
    return {
      message: 'Successfully delete post',
    };
  }

  @Get('/user/:user_id')
  @HttpCode(HttpStatus.OK)
  async getPostsByUser(
    @Param('user_id') user_id: string,
  ): Promise<{ message: string, data: PostAttributes | null }> {
    const userID = parseInt(user_id)
    const result = await this.postService.getPostsByUserService(userID);
    return {
      message: 'Successfully get posts by user',
      data: result
    };
  }
}
