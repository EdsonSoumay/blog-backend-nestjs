import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation/validation.service';
import { PostAttributes } from 'src/utils/model/post.model';
import { PostValidation } from 'src/utils/helpers/validationSchema.helpers';
import { PostRepository } from './post.repository';
import { handleValidationError } from 'src/utils/helpers/validationException.helpers';
import { deleteImage, removePreviousImage } from 'src/utils/helpers/removeFile.helpers';
import { SocketService } from 'src/common/socket/socket.service';
import { RedisClientType } from 'redis';
import { clearCacheRedis, isRedisConnected } from 'src/utils/helpers/redis.helpers';

@Injectable()
export class PostService {
  constructor(
    private validationService: ValidationService,
    private postRepository: PostRepository,
    private socketService: SocketService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType | null
  ){}


  //yang pake redis
  async getPostsService(search: string): Promise<any> {
    const isRedisClientOpen = await isRedisConnected(this.redisClient)
    
    // Buat cache key yang unik berdasarkan parameter pencarian
    const searchStr = String(search || '').toLowerCase(); // Memastikan selalu string
    const cacheKey = searchStr ? `posts:search:${searchStr}` : 'posts:all';

    try {
      if (isRedisClientOpen) {
        await this.redisClient.select(1); // Memilih database index 1
        // Cek apakah data sudah ada di Redis
        const cachedPosts = await this.redisClient.get(cacheKey);
        if (cachedPosts) {
          return JSON.parse(cachedPosts);
        }
      }

      // Jika tidak ada, ambil dari repository
      const posts = await this.postRepository.getPostsRepository(search);
  
      if(isRedisClientOpen){
        await this.redisClient.select(1); // Memilih database index 1
        // Simpan data ke Redis untuk caching dengan TTL 300 detik (5 menit)
        await this.redisClient.set(cacheKey, JSON.stringify(posts), {
          EX: 300,
        });
      }
  
      return posts;
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

      // Hapus cache untuk semua posts dan pencarian spesifik, jika ada
      clearCacheRedis(this.redisClient, 'posts:*')

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

     // Hapus cache untuk semua posts dan pencarian spesifik, jika ada
     clearCacheRedis(this.redisClient, 'posts:*')
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

     // Hapus cache untuk semua posts dan pencarian spesifik, jika ada
     clearCacheRedis(this.redisClient, 'posts:*')
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