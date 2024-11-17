import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation/validation.service';
import { CategoryAttributes } from 'src/utils/model/category.model';
import { CategoryValidation } from 'src/utils/helpers/validationSchema.helpers';
import { CategoryRepository } from './category.repository';
import { handleValidationError } from 'src/utils/helpers/validationException.helpers';
import { SocketService } from 'src/common/socket/socket.service';

@Injectable()
export class CategoryService {
  constructor(
    private validationService: ValidationService,
    private categoryRepository: CategoryRepository,
    private socketService: SocketService,
  ){}

  async getCategoriesService(): Promise<any> {
    try {
      const categories = await this.categoryRepository.getCategoriesRepository();
      return categories
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCategoryService(req: CategoryAttributes) {
    try {
      this.validationService.validate(CategoryValidation.CategoryValidationSchema, req);
      await this.categoryRepository.createCategoryRepository(req);
     
      const categories = await this.categoryRepository.getCategoriesRepository();
      this.socketService.emitToAll('all-categories', categories);
    } catch (err) {
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCategoryService(categoryId:number) :Promise<void>{
    try {
      await this.categoryRepository.deleteCategoryByIdRepository(categoryId);

      const categories = await this.categoryRepository.getCategoriesRepository();
      this.socketService.emitToAll('all-categories', categories);
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}