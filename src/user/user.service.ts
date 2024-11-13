import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) {
        throw new HttpException({ message: 'User not found' }, 404);
      }
      return user;
    } catch (err) {
      throw new HttpException({ message: err.message }, 500);
    }
  }
}
