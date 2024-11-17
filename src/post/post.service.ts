import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation/validation.service';
import { PostAttributes } from 'src/utils/model/post.model';
import { PostValidation } from 'src/utils/helpers/validationSchema.helpers';
import { PostRepository } from './post.repository';
import { handleValidationError } from 'src/utils/helpers/validationException.helpers';
import { deleteImage, removePreviousImage } from 'src/utils/helpers/removeFile.helpers';
import { SocketService } from 'src/common/socket/socket.service';
import { RedisClientType } from 'redis';

@Injectable()
export class PostService {
  constructor(
    private validationService: ValidationService,
    private postRepository: PostRepository,
    private socketService: SocketService,
    @Inject('REDIS_CLIENT') private redisClient: RedisClientType, // Tambahkan RedisClient sebagai dependensi
  ){}

  //yang pake redis
  async getPostsService(search: string): Promise<any> {
    try {
      // Cek apakah hasil pencarian sudah ada di Redis
      const cachedPosts = await this.redisClient.get(`posts:${search}`);
      if (cachedPosts) {
        // Jika ada, parsing hasilnya dan kembalikan
        return JSON.parse(cachedPosts);
      }

      // Jika tidak ada, ambil dari repository
      const posts = await this.postRepository.getPostsRepository(search);

      // Simpan hasil pencarian ke Redis dengan TTL (misalnya 3600 detik)
      await this.redisClient.set(`posts:${search}`, JSON.stringify(posts), {
        EX: 3600, // 1 jam
      });

      return posts;
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async getPostsService(search: string): Promise<any> {
  //   try {
  //     const posts = await this.postRepository.getPostsRepository(search);
  //     return posts
  //   } catch (err) {
  //     throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


  async createPostService(req: PostAttributes, userId: number) {
    try {
      this.validationService.validate(PostValidation.PostValidationSchema, req);
      await this.postRepository.createPostRepository(req);
     
      const posts = await this.postRepository.getPostsRepository('');
      this.socketService.emitToAll('all-posts', posts);
      if (userId) {
        const resultByUser = await this.postRepository.getPostsByUserIdRepository(userId);
        this.socketService.emitEventToRoom(`userId-${userId}`, `${userId}-all-posts`, resultByUser);
      }
    } catch (err) {
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editPostService(req: PostAttributes, postId: number, userId: number) {
    try {
      // Create the post
      this.validationService.validate(PostValidation.PostValidationSchema, req);
    
      const getPreviousPost = await this.postRepository.getPostByIdRepository(postId);
      removePreviousImage(req?.photo, getPreviousPost?.photo)
    
      if(req.photo === null && getPreviousPost?.photo){
        req.photo = getPreviousPost?.photo;
      }

     await this.postRepository.updatePostByIdRepository(postId, req);

     const posts = await this.postRepository.getPostsRepository('');
     this.socketService.emitToAll('all-posts', posts);
     if (userId) {
       const resultByUser = await this.postRepository.getPostsByUserIdRepository(userId);
       this.socketService.emitEventToRoom(`userId-${userId}`, `${userId}-all-posts`, resultByUser);
     }
    } catch (err) {
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deletePostService(postId:number, userId: number) :Promise<void>{
    try {
      const findPost = await this.postRepository.getPostByIdRepository(postId);
      deleteImage(findPost?.photo)
      await this.postRepository.deletePostByIdRepository(postId);

      const posts = await this.postRepository.getPostsRepository('');
      this.socketService.emitToAll('all-posts', posts);
      if (userId) {
        const resultByUser = await this.postRepository.getPostsByUserIdRepository(userId);
        this.socketService.emitEventToRoom(`userId-${userId}`, `${userId}-all-posts`, resultByUser);
      }
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getPostsByUserService(userID: number): Promise<any> {
    try {
      const posts = await this.postRepository.getPostsByUserIdRepository(userID);
      return posts
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPostService(postId: number): Promise<any> {
    try {
      const result = await this.postRepository.getPostByIdRepository(postId);
      return result
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}