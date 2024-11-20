import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserAttributes, UserAttributes } from '../utils/model/user.model';
import { Response, Request } from 'express';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}
 
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: UserAttributes
  ): Promise<{ message: string }> {
    
    await this.authService.register(request); // Panggil logika di service
    return {
      message: 'Successfully registered user',
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: LoginUserAttributes,
    @Res() res: Response
    ): Promise<void> { 
    try {
      const { user, token, refreshToken } = await this.authService.login(request);
      res.cookie('token', token, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .send({ message: 'Succesfully login', data: user})
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get('/refetch')
  @HttpCode(200)
  async refetch(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { user, newToken } = await this.authService.refetch(refreshToken); // Menggunakan refresh token

      // Mengatur cookie dengan token baru
      res.cookie('token', newToken, { httpOnly: true })
      .status(HttpStatus.OK).json({ message: 'Successfully refetch user', data: user });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Get('/logout')
  async logout(@Res() res: Response): Promise<Response> {
    try {
      return res
        .clearCookie('token', { sameSite: 'none', secure: true })
        .clearCookie('refreshToken', { sameSite: 'none', secure: true })
        .status(HttpStatus.OK)
        .send({ message: 'User logged out successfully!' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: error.message || 'An unexpected error occurred during logout.',
      });
    }
  }
}
