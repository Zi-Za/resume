export class UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  login?: string;
}

export class UpdateUserError {
  emailError: string[];
  firstNameError: string[];
  lastNameError: string[];
}

export class UpdateUserResponse {
  errors: UpdateUserError;
  message: string;
}