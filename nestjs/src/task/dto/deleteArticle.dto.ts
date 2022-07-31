import { UserEntity } from "@app/user/user.entity";

export class DeleteArticleError {
  idError: string[];
}

export class DeleteArticleResponse {
  errors: DeleteArticleError;
  message: string;
}

export class DeleteArticleRequest {
  user: Omit<UserEntity, 'password'>;
  id: number;
}
