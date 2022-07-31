import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { UserService } from "../user/user.service";
import { GetUserRequest } from '../user/dto/getUser.dto';
 
@Injectable()
export class RegistartionStrategy extends PassportStrategy(Strategy, 'register') {
  constructor(private readonly userService: UserService) {
    super();
  }
  async validate(req: Request): Promise<GetUserRequest> {
    
      const valid = await this.userService.validateCreateUser({
        login: req?.query?.login as string ?? '',
        password: req?.query?.password as string ?? '',
        email: req?.query?.email as string ?? '',
        confirmPassword: req?.query?.confirmPassword as string ?? '',
      });
     
      if (valid.errors !== null) {
        throw new HttpException({
          errors: valid.errors,
          user: null,
          message: 'Credentials is wrong',
        }, HttpStatus.NOT_ACCEPTABLE);
      }

      const user = {
        login: req?.query?.login as string,
      }
     
      return user;
  }
}