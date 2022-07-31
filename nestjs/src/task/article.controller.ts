import { Body, Controller, Get, Post, Put, UseGuards, Delete } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

import { CreateArticleRequest, CreateArticleResponse } from "@app/task/dto/createArticle.dto";
import { UpdateArticleRequest, UpdateArticleResponse } from '@app/task/dto/updateArticle.dto';
import { ArticleService } from "@app/task/article.service";
import { GetArticleRequest, GetArticleResponse, GetArticlesRequest, GetArticlesResponse } from "./dto/getArticle.dto";
import { DeleteArticleRequest, DeleteArticleResponse } from "@app/task/dto/deleteArticle.dto";


@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get('article')
  @UseGuards(AuthGuard('jwt'))
  async getArticle(getArticleRequest: GetArticleRequest): Promise<GetArticleResponse> {
    return this.articleService.getArticle(getArticleRequest);
  }

  @Get('articles')
  @UseGuards(AuthGuard('jwt'))
  async getArticles(getArticlesRequest: GetArticlesRequest): Promise<GetArticlesResponse> {
    return this.articleService.getArticles(getArticlesRequest);
  }

  @Post('article')
  @UseGuards(AuthGuard('jwt'))
  async createArticle(@Body()createArticleRequest: CreateArticleRequest): Promise<CreateArticleResponse> {
    return this.articleService.createArticle(createArticleRequest);
  }

  @Put('article')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(@Body()updateArticleRequest: UpdateArticleRequest): Promise<UpdateArticleResponse> {
    return this.articleService.updateArticle(updateArticleRequest);
  }

  @Delete('article')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticle(@Body()deleteArticleRequest: DeleteArticleRequest): Promise<DeleteArticleResponse> {
    return this.articleService.deleteArticle(deleteArticleRequest);
  }
}
