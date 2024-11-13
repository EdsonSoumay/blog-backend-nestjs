import { Injectable } from '@nestjs/common';
import { ObjectSchema } from 'yup';

@Injectable()
export class ValidationService {
  validate<T>(schema: ObjectSchema<T>, data: unknown): T {
    try {
      // Use `unknown` for input data to validate against the schema and cast the output
      return schema.validateSync(data, { abortEarly: false }) as T; 
    } catch (error) {
      throw error;
    }
  }
}
