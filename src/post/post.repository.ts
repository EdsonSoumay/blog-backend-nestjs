import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PostAttributes } from 'src/utils/model/post.model';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPostRepository(req: PostAttributes): Promise<void> {
    await this.prismaService.posts.create({
      data: {
        title: req.title,
        desc: req.desc,
        photo: req.photo ?? null,
        user: {
          connect: { id: req.user_id }, // Menghubungkan ke user_id dari req
        },
        category: {
          connect: { id: req.category_id }, // Menghubungkan ke category_id dari req
        },
      },
    });
  }

  async getPostsRepository(search: string | undefined): Promise<any[]> {
    let result = [];
    if (search) {
      result = await this.prismaService.posts.findMany({
        where: {
          title: {
            contains: search, // Similar to Op.like in Sequelize
            // mode: 'insensitive', // Optional: makes the search case-insensitive
          },
        },
        include: {
          user: true, // This will include the associated user model
        },
      });
      
    } else {
      result = await this.prismaService.posts.findMany({
        include: {
          user: true, // Includes the associated User model
        },
      });
    }
    return result;
  }

  async getPostRepositoryById(postId: number): Promise<PostAttributes>{
   return await this.prismaService.posts.findUnique({where:{id:postId}})
  }

  async updatePostRepositoryById (postId:number, value: PostAttributes): Promise<void> {
    await this.prismaService.posts.update({
      where: {id:postId},
      data: {
        title: value.title,
        desc: value.desc,
        user_id: value.user_id,
        category_id: value.category_id,
        photo: value.photo
      },
    });
  }

  async deletePostRepositoryById(postId:number): Promise<void>{
     await this.prismaService.posts.delete({where:{id:postId}})
  }
}