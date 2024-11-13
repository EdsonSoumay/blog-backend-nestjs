import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ExceptionService implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    response.status(status).json({
      message: errorResponse['message'] || 'Something went wrong',
    });
  }
}
