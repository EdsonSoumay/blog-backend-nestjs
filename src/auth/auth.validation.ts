import * as yup from 'yup';

export class UserValidation {
  static readonly REGISTER = yup.object().shape({
    username: yup.string().required().min(1).max(100),
    last_name: yup.string().required().min(1).max(100),
    first_name: yup.string().required().min(1).max(100),
    email: yup.string().required().email().max(100),
    password: yup.string().required().min(1).max(100),
  });

  static readonly LOGIN = yup.object().shape({
    username: yup.string().required().min(1).max(100),
    password: yup.string().required().min(1).max(100),
  });

  static readonly UPDATE = yup.object().shape({
    name: yup.string().min(1).max(100),
    password: yup.string().min(1).max(100),
  });
}
