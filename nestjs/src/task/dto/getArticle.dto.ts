import { UserEntity } from "@app/user/user.entity";

export class GetArticleError {
  idError: string[];
}

export class GetArticle {
  id: number;
  slug: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  user: Omit<UserEntity, 'password'>;
}

export class GetArticleRequest {
  user?: UserEntity;
  id: number;
}

export class GetArticleResponse {
  errors: GetArticleError;
  content: GetArticle;
  message: string;
}


export class GetArticlesError {
  offsetError: string[];
  limitError: string[];
}

export class GetArticlesRequest {
  user: Omit<UserEntity, 'password'>;
  page: number;
  limit: number;
}

export class GetArticlesResponse {
  errors: GetArticlesError;
  content: {articles: Array<GetArticle>, total: number, currentPage: number, limit: number};
  message: string;
}

