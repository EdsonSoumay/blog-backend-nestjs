import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation/validation.service';
import { CommentAttributes } from 'src/utils/model/comment.model';
import { CommentValidation } from 'src/utils/helpers/validationSchema.helpers';
import { CommentRepository } from './comment.repository';
import { handleValidationError } from 'src/utils/helpers/validationException.helpers';
import { SocketService } from 'src/common/socket/socket.service';

@Injectable()
export class CommentService {
  constructor(
    private validationService: ValidationService,
    private commentRepository: CommentRepository,
    private socketService: SocketService,
  ){}

  async createCommentService(req: CommentAttributes) {
    try {
      const convertedData = this.validationService.convert(CommentValidation.CommentValidationSchema, req);
      const validationData = this.validationService.validate(CommentValidation.CommentValidationSchema, convertedData);
    
      await this.commentRepository.createCommentRepository(validationData);
 
      const postId = validationData.post_id
      if(postId){
        const result = await this.commentRepository.getCommentsByPostRepository(postId);
        this.socketService.emitEventToRoom(`postId-${postId}`, `${postId}-all-comments`, result);
      }
    } catch (err) {
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPostCommentsService(postId: number): Promise<any> {
    try {
      const comments = await this.commentRepository.getCommentsByPostRepository(postId);
      return comments
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCommentService(commentId:number) :Promise<void>{
    try {
      const findComment = await this.commentRepository.getCommentByIdRepository(commentId);
      await this.commentRepository.deleteCommentByIdRepository(commentId);

      const postId = findComment.post_id
      if(postId){
        const result = await this.commentRepository.getCommentsByPostRepository(postId);
        this.socketService.emitEventToRoom(`postId-${postId}`, `${postId}-all-comments`, result);
      }
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}