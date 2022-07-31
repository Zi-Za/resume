import { UserEntity } from "../user.entity";

export class GetUserError {
  emailError: string[];
  loginError: string[];
  passwordError: string[];
}

export class GetUserResponse {
  errors: GetUserError;
  content: Omit<UserEntity, 'password'>;
  message: string;
}

export class GetUserRequest {
  login: string;
}