import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryAttributes } from 'src/utils/model/category.model';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createCategoryRepository(req: CategoryAttributes): Promise<void> {
    await this.prismaService.categories.create({
      data: req
    });
  }

  async getCategoriesRepository(): Promise<CategoryAttributes[]> {
    return await this.prismaService.categories.findMany({})
  }
  
  async getCategoryByIdRepository(categoryId:number): Promise<void> {
    await this.prismaService.categories.findUnique({where:{id:categoryId}})
  }

  async deleteCategoryByIdRepository(categoryId:number): Promise<void>{
     await this.prismaService.categories.delete({where:{id:categoryId}})
  }
}