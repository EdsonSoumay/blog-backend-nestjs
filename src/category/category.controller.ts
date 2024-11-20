import { CategoryAttributes } from 'src/utils/model/category.model';
import { CategoryService } from './category.service';
import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Put, Param, Delete, ParseIntPipe} from '@nestjs/common';

@Controller('/api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() req: CategoryAttributes, 
    ): Promise<{ message: string }> {
    await this.categoryService.createCategoryService(req);
    return {
      message: 'Successfully created category',
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getCategories(): Promise<{ message: string, data: CategoryAttributes | null }> {
    const result = await this.categoryService.getCategoriesService();
    return {
      message: 'Successfully get categories',
      data: result
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param('id', ParseIntPipe) id: number, 
  ): Promise<{ message: string }> {
    await this.categoryService.deleteCategoryService(id);
    return {
      message: 'Successfully delete category',
    };
  }
}