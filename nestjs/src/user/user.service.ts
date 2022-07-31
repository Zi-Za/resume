import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { GetUserResponse, GetUserRequest } from "@app/user/dto/getUser.dto";
import { CreateUserResponse, CreateUserRequest } from "@app/user/dto/createUser.dto";
import { UserEntity } from "@app/user/user.entity";
import { UpdateUserRequest, UpdateUserResponse } from "@app/user/dto/updateUser.dto";
import { AuthorizeUserRequest, AuthorizeUserResponse } from "@app/user/dto/authorizeUser.dto";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>, private jwtService:JwtService) {}
  
  async getUser (getUserResponse: GetUserRequest): Promise<GetUserResponse> {

    console.log('env', process.env.IS_DEVELOP_MODE)

    // const user = await this.userRepository.findOne({login: getUserResponse.login});
    // const {password, ...userWithoutPassword} = user;
    // const gettingUser = {
    //   errors: null,
    //   content: userWithoutPassword,
    //   message:'User successfully getted',
    // }
    const gettingUser = {
      errors: null,
      content: null,
      message:'Какой то контент1',
    }
    return gettingUser;
  }

  async createUser (createUserRequest: CreateUserRequest ): Promise<CreateUserResponse> {
    const resultValidation = await this.validateCreateUser(createUserRequest);
    return resultValidation
  }

  async authUser (authorizeUserRequest: AuthorizeUserRequest): Promise<AuthorizeUserResponse> {
    const resultValidation = await this.validateAuthorizeUser(authorizeUserRequest);
    return resultValidation
  }
 
  async updateUser (updateUserRequest: UpdateUserRequest): Promise<UpdateUserResponse> {
    const resultValidation = await this.validateUpdateUser(updateUserRequest);
    if(!resultValidation.errors){
      const user = await this.userRepository.findOne({login: updateUserRequest.login});
      await this.userRepository.update({id: user.id}, {...updateUserRequest});
    }
    return resultValidation
  }

  async getJwtToken(coookieData: GetUserRequest): Promise<string>{
    const payload = {
     ...coookieData
    }
    return this.jwtService.signAsync(payload);
  }

  async validateCreateUser (createUserRequest: CreateUserRequest): Promise<CreateUserResponse>{
    const creatingUser = {
      errors: null,
      user: null,
      message:'User successfully created',
    }

    // Password validation

    if (!createUserRequest.password || !createUserRequest.confirmPassword) {
      creatingUser.errors = {...creatingUser?.errors, passwordError: [...creatingUser?.errors?.passwordError ?? [], "Password and Confirm password can't be empty"]};
      creatingUser.message = 'Error creating user';
    }

    if (createUserRequest.password !== createUserRequest.confirmPassword) {
      creatingUser.errors = {...creatingUser?.errors, passwordError: [...creatingUser?.errors?.passwordError ?? [], "Confirm password not matching"]};
      creatingUser.message = 'Error creating user';
    }

    if (!/^[a-z0-9_-]{3,16}$/.test(createUserRequest.password)) {
      creatingUser.errors = {...creatingUser?.errors, passwordError: [...creatingUser?.errors?.passwordError ?? [], "Maximum password length must be 3-16 characters. Valid characters 'a-z 0-9 _ -'"]};
      creatingUser.message = 'Error creating user';
    }

    // Email validation

    if (!createUserRequest.email) {
      creatingUser.errors = {...creatingUser?.errors, emailError: [...creatingUser?.errors?.emailError ?? [], "Email can't be empty"] };
      creatingUser.message = 'Error creating user';
    }

    if (!/^([a-z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/.test(createUserRequest.email)) {
      creatingUser.errors = {...creatingUser?.errors, emailError: [...creatingUser?.errors?.emailError ?? [], "Maximum email length must be 2-6 characters and have got symbol '@'. Valid characters 'a-z 0-9 _ - .'"]};
      creatingUser.message = 'Error creating user';
    }

    const userByEmail = await this.userRepository.findOne({ email: createUserRequest.email });

    if (userByEmail && userByEmail.email) {
      creatingUser.errors = {...creatingUser?.errors, emailError: [...creatingUser?.errors?.emailError ?? [], "Email already exist"]};
      creatingUser.message = 'Error creating user';
    }

    // Login validation

    if (!createUserRequest.login) {
      creatingUser.errors = {...creatingUser?.errors, loginError: [...creatingUser?.errors?.loginError ?? [], "Login can't be empty"]};
      creatingUser.message = 'Error creating user';
    }

    if (!/^[a-z0-9_-]{3,16}$/.test(createUserRequest.login)) {
      creatingUser.errors = {...creatingUser?.errors, loginError: [...creatingUser?.errors?.loginError ?? [], "Maximum login length must be 3-16 characters. Valid characters 'a-z 0-9 _ -'"]};
      creatingUser.message = 'Error creating user';
    }

    const userByLogin = await this.userRepository.findOne({ login: createUserRequest.login });

    if (userByLogin && userByLogin.login) {
      creatingUser.errors = {...creatingUser?.errors, loginError: [...creatingUser?.errors?.loginError ?? [], "Login already exist"]};
      creatingUser.message = 'Error creating user';
    }

    if(!creatingUser.errors){
      const newUser = new UserEntity();
      const hashPassword = await this.getPasswordHash(createUserRequest.password);
      await this.userRepository.save({...newUser, ...createUserRequest, password:hashPassword })
      const {password, ...userWithoutPassword} = await this.userRepository.findOne({ login: createUserRequest.login });
      creatingUser.user = userWithoutPassword;
    }
    return creatingUser 
  }

  async validateAuthorizeUser (authorizeUserRequest: AuthorizeUserRequest): Promise<AuthorizeUserResponse> {
   
    const autorizationUser = {
      errors: null,
      user: null,
      message:'User successfully authorization',
    }

    // Password validation

    if (!authorizeUserRequest.password) {
      autorizationUser.errors = {...autorizationUser?.errors, passwordError: [...autorizationUser?.errors?.passwordError ?? [], "Password can't be empty"]};
      autorizationUser.message = 'Error authorization user';
    }

    // Login validation

    if (!authorizeUserRequest.login) {
      autorizationUser.errors = {...autorizationUser?.errors, loginError: [...autorizationUser?.errors?.loginError ?? [], "Login can't be empty"]};
      autorizationUser.message = 'Error authorization user';
    }

    const userByLogin = await this.userRepository.findOne({ login: authorizeUserRequest.login });
    const validPassword = await this.comparePasswordHashAndPlainTextPassword(authorizeUserRequest?.password, userByLogin?.password);

    if (!(userByLogin && validPassword) ) {
      autorizationUser.errors = {...autorizationUser?.errors, loginError: [...autorizationUser?.errors?.loginError ?? [], "Login or password is wrong"], passwordError: [...autorizationUser?.errors?.passwordError ?? [], "Login or password is wrong"]};
      autorizationUser.message = 'Error authorization user';
    }
    
    if(!autorizationUser.errors){
      const {password, ...userWithoutPassword} = userByLogin;
      autorizationUser.user = userWithoutPassword;
    }

    return autorizationUser
  }

  async validateUpdateUser (updateUserRequest: UpdateUserRequest): Promise<UpdateUserResponse>{
    const updatingUser = {
      errors: null,
      message:'User successfully updated',
    }

    // FirstName validation

    if (!updateUserRequest.firstName) {
      updatingUser.errors = {...updatingUser?.errors, firstName: [...updatingUser?.errors?.firstNameError ?? [], "FirstName can't be empty"] };
      updatingUser.message = 'Error creating user';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(updateUserRequest.firstName)) {
      updatingUser.errors = {...updatingUser?.errors, firstName: [...updatingUser?.errors?.firstNameError ?? [], "Maximum firstName length must be 3-16 characters. Valid characters 'a-zA-ZА-Яа-я'"]};
      updatingUser.message = 'Error creating user';
    }

    // LastName validation

    if (!updateUserRequest.lastName) {
      updatingUser.errors = {...updatingUser?.errors, lastName: [...updatingUser?.errors?.lastNameError ?? [], "LastName can't be empty"] };
      updatingUser.message = 'Error creating user';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(updateUserRequest.lastName)) {
      updatingUser.errors = {...updatingUser?.errors, lastName: [...updatingUser?.errors?.lastNameError ?? [], "Maximum lastName length must be 3-16 characters. Valid characters 'a-z 0-9 _ -'"]};
      updatingUser.message = 'Error creating user';
    }

    // Email validation

    if (!updateUserRequest.email) {
      updatingUser.errors = {...updatingUser?.errors, emailError: [...updatingUser?.errors?.emailError ?? [], "Email can't be empty"] };
      updatingUser.message = 'Error creating user';
    }

    if (!/^([a-z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/.test(updateUserRequest.email)) {
      updatingUser.errors = {...updatingUser?.errors, emailError: [...updatingUser?.errors?.emailError ?? [], "Maximum email length must be 2-6 characters and have got symbol '@'. Valid characters 'a-z 0-9 _ - .'"]};
      updatingUser.message = 'Error creating user';
    }

    return updatingUser
  }

  async getPasswordHash(password: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

  async comparePasswordHashAndPlainTextPassword(hash: string, password: string): Promise<boolean> {
    if(hash && password) {
      return await await bcrypt.compare(hash, password);
    }
  }

  async validateUserToken(login: string, password: string):Promise<boolean> {
    const user = await this.userRepository.findOne({ login });
    if (user === null) return false;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return false;
    
    return true;
  }
}