import { UserEntity } from "@app/user/user.entity";
import { ArticleEntity } from "../article.entity";

export class CreateArticleError {
  titleError: string[];
  descriptionError: string[];
}

export class CreateArticleResponse {
  errors: CreateArticleError;
  article?: ArticleEntity;
  message: string;
}

export class CreateArticleRequest {
  title: string;
  description: string;
  user: Omit<UserEntity, 'password'>;
}
