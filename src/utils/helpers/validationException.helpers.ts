import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'yup';

export function handleValidationError(err: any): void {
  if (err instanceof ValidationError) {
    throw new HttpException(
      {
        message: 'Validation failed, check your info again',
        details: err.errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
