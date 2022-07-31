import { UserEntity } from "@app/user/user.entity";

export class UpdateArticleError {
  idError: string[];
  titleError: string[];
  descriptionError: string[];
}

export class UpdateArticleResponse {
  errors: UpdateArticleError;
  message: string;
}

export class UpdateArticleRequest {
  id: number;
  title: string;
  description: string;
  user: Omit<UserEntity, 'password'>;
}