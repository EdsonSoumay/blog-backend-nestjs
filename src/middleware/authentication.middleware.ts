import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../common/jwt/jwt.service';
import { UserRepository } from 'src/user/user.repository';

interface AuthenticatedRequest extends Request {
  user_id?: string;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private userRepository: UserRepository
  ) {}
  
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    // console.log("Token Di Middleware:",token)
    if (!token) {
      throw new HttpException({ message: 'You are not authenticated!' }, HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = this.jwtService.extractToken(token);
    
      const user = await this.userRepository.getUserByIdRepository(decoded.id);
      if (!user) {
        return res
          .clearCookie('token', { sameSite: 'none', secure: true })
          .clearCookie('refreshToken', { sameSite: 'none', secure: true })
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'User does not exist in authorization' });
      }
      req.user_id = decoded.id.toString();
      next();
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Token is not valid!' });
    }
  }
}