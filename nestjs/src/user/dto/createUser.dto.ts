import { UserEntity } from "../user.entity";

export class CreateUserError {
  emailError: string[];
  loginError: string[];
  passwordError: string[];
}

export class CreateUserResponse {
  errors: CreateUserError;
  user: Omit<UserEntity, 'password'>;;
  message: string;
}

export class CreateUserRequest {
  login: string;
  password: string;
  email: string;
  confirmPassword: string;
}