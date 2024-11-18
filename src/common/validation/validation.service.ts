import { Injectable } from '@nestjs/common';
import { ObjectSchema } from 'yup';

@Injectable()
export class ValidationService {
  validate<T>(schema: ObjectSchema<T>, data: unknown): T {
    try {
      return schema.validateSync(data, { abortEarly: false, strict: true }) as T; // strict: true agar tipe data harus sesuai yang didefinisikan
    } catch (error) {
      throw error;
    }
  }
}
