import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation/validation.service';
import { PostAttributes } from 'src/utils/model/post.model';
import { PostValidation } from 'src/utils/helpers/validationSchema.helpers';
import { PostRepository } from './post.repository';
import { handleValidationError } from 'src/utils/helpers/validationException.helpers';

@Injectable()
export class PostService {
  constructor(
    private validationService: ValidationService,
    private postRepository: PostRepository
  ){}

  async createPostService(req: PostAttributes, userId: number) {
    try {
      // Create the post
      this.validationService.validate(PostValidation.PostValidationSchema, req);
      await this.postRepository.createPostRepository(req);
    } catch (err) {
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editPostService(req: PostAttributes, postId: number) {
    try {
      // Create the post
      this.validationService.validate(PostValidation.PostValidationSchema, req);
      // const getPreviousPost = await this.postRepository.getPostRepositoryById(postId);
      const updatePost = await this.postRepository.updatePostRepositoryById(postId, req);
    } catch (err) {
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPostsService(search: string): Promise<any> {
    try {
      const posts = await this.postRepository.getPostsRepository(search);
      return posts
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
