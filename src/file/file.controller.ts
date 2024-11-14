import { Controller, Post, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Controller('api/upload')
export class FileController {
  @Post('/')
  handleFileUpload(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      // Business logic for file upload can go here
      return res.status(200).send({ message: 'Image has been uploaded successfully!' });
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
}
