import { UserEntity } from "../user.entity";

export class AuthorizeUserError {
  loginError: string[];
  passwordError: string[];
}

export class AuthorizeUserResponse {
  errors: AuthorizeUserError;
  user: Omit<UserEntity, 'password'>;;
  message: string;
}

export class AuthorizeUserRequest {
  login: string;
  password: string;
}