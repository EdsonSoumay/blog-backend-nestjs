import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PostAttributes } from 'src/utils/model/post.model';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(req: PostAttributes): Promise<void> {
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
}
