import * as yup from 'yup';

export class UserValidation {
  static readonly userValidationSchema = yup.object().shape({
    username: yup.string().required().min(1).max(100),
    last_name: yup.string().required().min(1).max(100),
    first_name: yup.string().required().min(1).max(100),
    email: yup.string().required().email().max(100),
    password: yup.string().required().min(1).max(100),
  });

  static readonly loginSchema = yup.object().shape({
    username: yup.string().required().min(1).max(100),
    password: yup.string().required().min(1).max(100),
  });
}

export class PostValidation {
  static readonly PostValidationSchema = yup.object().shape({
    title: yup.string().required().min(1).max(50),
    desc: yup.string().required().min(1).max(100),
    user_id: yup.number().required(),
    category_id: yup.number().required(),
    photo: yup.string().nullable()
  });
}


export class CategoryValidation {
  static readonly CategoryValidationSchema = yup.object().shape({
    category_description: yup.string().required().min(1).max(100),
  });
}