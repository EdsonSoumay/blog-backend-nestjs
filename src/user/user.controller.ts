import { Controller, Get, Param, HttpCode } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get('/:id')
  @HttpCode(200)
  async getUser(
    @Param('id') id: string, 
    ): Promise<{ message: string, data: Object}> {
    const IdInt = parseInt(id)
    const user = await this.userRepository.findUserById(IdInt);
    return {
        message: 'successfuly get user',
        data: user
    };
  }
}