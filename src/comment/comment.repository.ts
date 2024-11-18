import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CommentAttributes } from 'src/utils/model/comment.model';

@Injectable()
export class CommentRepository {
  constructor(private readonly prismaService: PrismaService) {}
  
  async createCommentRepository(req: CommentAttributes): Promise<void> {
    await this.prismaService.comments.create({
      data: {
        comment: req.comment,
        user: {
            connect: { id: req.user_id }, 
          },
        post: {
            connect: { id: req.post_id },
          },
      },
    });
  }

  async getCommentsByPostRepository(postId: number): Promise<CommentAttributes[]> {
        return await this.prismaService.comments.findMany({
            where: { post_id: postId },
            include: {
                user: true,
            },
        });
  }

  async getCommentByIdRepository(commentId: number): Promise<CommentAttributes>{
   return await this.prismaService.comments.findUnique({where:{id:commentId}})
  }

  async deleteCommentByIdRepository(postId:number): Promise<void>{
     await this.prismaService.comments.delete({where:{id:postId}})
  }
}