import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ValidationService } from 'src/common/validation/validation.service';
import { UserAttributes } from 'src/utils/model/user.model';
import { UserValidation } from 'src/utils/helpers/validationSchema.helpers';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private validationService: ValidationService,
    private bcryptService: BcryptService
  ) {}

  async getUserService(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findUserByIdRepository(id);
      if (!user) {
        throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editUserService(req:UserAttributes,  id: number): Promise<any> {
    this.validationService.validate(UserValidation.userValidationSchema, req);
    try {
      req.password = await this.bcryptService.PasswordHashing(req.password)
      await this.userRepository.updateUserRepository(id, req)
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUserService(id: number): Promise<any> {
    try {
      await this.userRepository.deleteUserRepository(id)
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
