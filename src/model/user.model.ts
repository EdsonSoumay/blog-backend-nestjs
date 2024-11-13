export class RegisterUserRequest {
  username: string;
  password: string;
  first_name: string;
  last_name: string;	
  email: string;
}

export class UserRequest {
  id?: number
  username: string;
  password: string;
}