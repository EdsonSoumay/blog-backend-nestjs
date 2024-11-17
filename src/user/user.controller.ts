import { Controller, Get, Param, HttpCode, Put, HttpStatus, Body, Delete } from '@nestjs/common';
import { UserAttributes } from 'src/utils/model/user.model';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Param('id') id: string, 
    ): Promise<{ message: string, data: UserAttributes}> {
    const IdInt = parseInt(id)
    const user = await this.userService.getUserService(IdInt);
    return {
        message: 'successfuly get user',
        data: user
    };
  }

  //ini belum di testing
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async editUser(
    @Param('id') id: string, 
    @Body() req: UserAttributes
    ): Promise<{ message: string}> {
    const IdInt = parseInt(id)
    await this.userService.editUserService(req, IdInt)
    return {
        message: 'successfuly update user',
    };
  }


  // ini belum di testing
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') id: string, 
    ): Promise<{ message: string}> {
    const IdInt = parseInt(id)
    await this.userService.deleteUserService(IdInt)
    return {
        message: 'successfuly delete user',
    };
  }
}