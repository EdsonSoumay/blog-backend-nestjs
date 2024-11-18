import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Delete, ParseIntPipe, UsePipes, ValidationPipe} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentAttributes } from 'src/utils/model/comment.model';

@Controller('/api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Body() req: CommentAttributes, 
    ): Promise<{ message: string }> {
    await this.commentService.createCommentService(req);
    return {
      message: 'Successfully created comment',
    };
  }

  @Get('/post/:post_id')
  @HttpCode(HttpStatus.OK)
  async getPostComments(
    @Param('post_id', ParseIntPipe) post_id: number,
  ): Promise<{ message: string, data: CommentAttributes | null }> {
    const result = await this.commentService.getPostCommentsService(post_id);
    return {
      message: 'Successfully get comments',
      data: result
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() req: CommentAttributes, 
  ): Promise<{ message: string }> {
    await this.commentService.deleteCommentService(id);
    return {
      message: 'Successfully delete comment',
    };
  }
}