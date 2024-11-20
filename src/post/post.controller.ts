import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Put, Param, Delete, ParseIntPipe} from '@nestjs/common';
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
    @Param('id', ParseIntPipe) id: number, 
    @Body() req: PostAttributes, 
    ): Promise<{ message: string }> {
    const userId = req?.user_id;
    await this.postService.editPostService(req, id, userId);
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
    @Param('id', ParseIntPipe) id: number, 
  ): Promise<{ message: string, data: PostAttributes | null }> {
    const result = await this.postService.getPostService(id);
    return {
      message: 'Successfully get post',
      data: result
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param('id', ParseIntPipe) id: number, 
    @Body() req: PostAttributes, 
  ): Promise<{ message: string }> {
    const userId = req?.user_id;
    await this.postService.deletePostService(id, userId);
    return {
      message: 'Successfully delete post',
    };
  }

  @Get('/user/:user_id')
  @HttpCode(HttpStatus.OK)
  async getPostsByUser(
    @Param('user_id', ParseIntPipe) user_id: number, 
  ): Promise<{ message: string, data: PostAttributes | null }> {
    const result = await this.postService.getPostsByUserService(user_id);
    return {
      message: 'Successfully get posts by user',
      data: result
    };
  }
}