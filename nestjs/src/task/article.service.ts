import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { GetArticleResponse, GetArticlesResponse, GetArticleRequest, GetArticlesRequest } from "./dto/getArticle.dto";
import { CreateArticleRequest, CreateArticleResponse } from "./dto/createArticle.dto";
import { ArticleEntity } from "./article.entity";
import { UpdateArticleRequest, UpdateArticleResponse } from "./dto/updateArticle.dto";
import { DeleteArticleRequest, DeleteArticleResponse, RequestDeleteArticleDto, ResponseDeleteArticleDto } from "./dto/deleteArticle.dto";

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(ArticleEntity) private readonly articleRepository :Repository<ArticleEntity>) {}
  
  async getArticle (getArticleRequest: GetArticleRequest): Promise<GetArticleResponse> {

    export class GetArticleRequest {
      user?: UserEntity;
      id: string;
    }


    const timetable = await this.articleRepository.find();


    return timetable;
  }

  async getArticles (getArticlesRequest: GetArticlesRequest): Promise<GetArticlesResponse> {
    const timetable = await this.articleRepository.find();
    return timetable;
  }

  async createArticle (createArticleRequest: CreateArticleRequest): Promise<CreateArticleResponse>{
    const newArticle = new ArticleEntity();
    const article = await this.articleRepository.save({
      ...newArticle,
      title: createArticleRequest.title,
      description: createArticleRequest.description,
      user: createArticleRequest.user,
    })

    return {
      errors: null,
      article: article,
      message: 'Article successfully created',
    }
  }

  async updateArticle (updateArticleRequest: UpdateArticleRequest): Promise<UpdateArticleResponse> {

    const article = await this.articleRepository.find({id: updateArticleRequest.id})
    return await this.articleRepository.save({...article, 
      title: updateArticleRequest.title,
      description: updateArticleRequest.description,
      ...updateArticleRequest
    });
  }

  async deleteArticle (deleteArticleRequest: DeleteArticleRequest): Promise<DeleteArticleResponse> {
    const resultValidation = await this.validateDeleteArticle(deleteArticleRequest);
    await this.articleRepository.delete({id: deleteArticleRequest.id})
    return resultValidation
  }











  async validateCreateArtcile (createArticleRequest: CreateArticleRequest): Promise<CreateArticleResponse> {
    const createArticle = {
      errors: null,
      message:'Article successfully created',
    }
    // Description validation

    if (!requestCreateArticleDto.description) {
      createArticle.errors = {...createArticle?.errors, descriptionError: [...createArticle?.errors?.descriptionError ?? [], "Description can't be empty"]};
      createArticle.message = 'Error creating article';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(requestCreateArticleDto.description)) {
      createArticle.errors = {...createArticle?.errors, descriptionError: [...createArticle?.errors?.descriptionError ?? [], "Maximum description length must be 3-16 characters. Valid characters 'a-zA-ZА-Яа-я'"]};
      createArticle.message = 'Error creating article';
    }

    // Date validation
    if (!requestCreateArticleDto.date) {
      createArticle.errors = {...createArticle?.errors, dateError: [...createArticle?.errors?.dateError ?? [], "Date can't be empty"]};
      createArticle.message = 'Error creating article';
    }

    // Time validationid

    if (!requestCreateArticleDto.time) {
      createArticle.errors = {...createArticle?.errors, timeError: [...createArticle?.errors?.timeError ?? [], "Time can't be empty"]};
      createArticle.message = 'Error creating article';
    }

    return createArticle
  }







  async validateUpdateArticle (requestUpdateArticleDto: RequestUpdateArticleDto): Promise<ResponseUpdateArticleDto> {
    const updateArticle = {
      errors: null,
      message:'Article successfully updated',
    }
    // Description validation

    if (!requestUpdateArticleDto.description) {
      updateArticle.errors = {...updateArticle?.errors, descriptionError: [...updateArticle?.errors?.descriptionError ?? [], "Description can't be empty"]};
      updateArticle.message = 'Error updating article';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(requestUpdateArticleDto.description)) {
      updateArticle.errors = {...updateArticle?.errors, descriptionError: [...updateArticle?.errors?.descriptionError ?? [], "Maximum description length must be 3-16 characters. Valid characters 'a-zA-ZА-Яа-я'"]};
      updateArticle.message = 'Error updating article';
    }

    // Date validation
    if (!requestUpdateArticleDto.date) {
      updateArticle.errors = {...updateArticle?.errors, dateError: [...updateArticle?.errors?.dateError ?? [], "Date can't be empty"]};
      updateArticle.message = 'Error updating article';
    }

    // Time validationid

    if (!requestUpdateArticleDto.time) {
      updateArticle.errors = {...updateArticle?.errors, timeError: [...updateArticle?.errors?.timeError ?? [], "Time can't be empty"]};
      updateArticle.message = 'Error updating article';
    }

     // Id validationid

     if (!requestUpdateArticleDto.id) {
      updateArticle.errors = {...updateArticle?.errors, idError: [...updateArticle?.errors?.idError ?? [], "Time can't be empty"]};
      updateArticle.message = 'Error updating article';
    }

    const articleById = await this.articleRepository.findOne({ id: requestUpdateArticleDto.id });

    if (!articleById) {
      updateArticle.errors = {...updateArticle?.errors, idError: [...updateArticle?.errors?.idError ?? [], "Id doesn't exist"]};
      updateArticle.message = 'Error updating article';
    }

    return updateArticle
  }







  async validateDeleteArticle(requestDeleteArticleDto: RequestDeleteArticleDto): Promise<ResponseDeleteArticleDto> {

    const deleteArticle = {
      errors: null,
      message:'Article successfully deleted',
    }

    // Id validationid

    if (!requestDeleteArticleDto.id) {
      deleteArticle.errors = {...deleteArticle?.errors, idError: [...deleteArticle?.errors?.idError ?? [], "Id can't be empty"]};
      deleteArticle.message = 'Error deleting article';
    }

    const articleById = await this.articleRepository.findOne({ id: requestDeleteArticleDto.id });

    if (!articleById) {
      deleteArticle.errors = {...deleteArticle?.errors, idError: [...deleteArticle?.errors?.idError ?? [], "Id doesn't exist"]};
      deleteArticle.message = 'Error deleting article';
    }

    return deleteArticle
  }
}