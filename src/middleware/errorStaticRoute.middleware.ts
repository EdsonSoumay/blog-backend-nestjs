import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class ErrorStaticRouteMiddleware implements NestMiddleware {
  use(req:Request, res: Response, next: NextFunction) : void {
    res.on('finish', () => {
      if (res.statusCode === 404) {
        console.error(`Static file not found: ${req.originalUrl}`);
      }
    });
    next();
  }
}