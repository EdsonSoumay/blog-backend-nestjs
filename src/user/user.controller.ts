import { Controller, Get, Param, HttpCode, Put, HttpStatus, Body, Delete, ParseIntPipe } from '@nestjs/common';
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
    @Param('id', ParseIntPipe) id: number, 
    ): Promise<{ message: string, data: UserAttributes}> {
    const user = await this.userService.getUserService(id);
    return {
        message: 'successfuly get user',
        data: user
    };
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async editUser(
    @Param('id', ParseIntPipe) id: number, 
    @Body() req: UserAttributes
    ): Promise<{ message: string}> {
    await this.userService.editUserService(req, id)
    return {
        message: 'successfuly update user',
    };
  }


  // ini belum di testing
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number, 
    ): Promise<{ message: string}> {
    await this.userService.deleteUserService(id)
    return {
        message: 'successfuly delete user',
    };
  }
}