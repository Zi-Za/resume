import { Body, Controller, Get, Post, Put, UseGuards, Req, Res } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { GetUserResponse } from "@app/user/dto/getUser.dto";
import { CreateUserResponse } from "./dto/createUser.dto";
import { UpdateUserRequest, UpdateUserResponse } from "./dto/updateUser.dto";
import { AuthorizeUserResponse } from "./dto/authorizeUser.dto";
import { UserService } from "./user.service";



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  // @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req): Promise<GetUserResponse> {
    return this.userService.getUser({login: req?.user?.login});
  }

  @Post('create')
  @UseGuards(AuthGuard('register'))
  async createUser(@Req() req, @Res({ passthrough: true }) res: Response): Promise<CreateUserResponse> {
    const token = await this.userService.getJwtToken({login: req?.user?.login });
    res.cookie('auth-cookie', { token }, { httpOnly:true, sameSite: 'none', secure: true });
    return this.userService.createUser({
      login: req?.query?.login,
      password: req?.query?.password,
      confirmPassword: req?.query?.confirmPassword,
      email: req?.query?.email,
    });
  }

  @Post('auth')
  @UseGuards(AuthGuard('auth'))
  async authUser(@Req() req, @Res({ passthrough: true }) res: Response): Promise<AuthorizeUserResponse> {
    const token = await this.userService.getJwtToken({login: req?.user?.login });
    res.cookie('auth-cookie', { token }, {httpOnly:true, sameSite: 'none', secure: true });
    return this.userService.authUser({login: req?.query?.login, password: req?.query?.password});
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Req() req, @Body()updateUserRequest: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.userService.updateUser({...updateUserRequest, login: req?.user?.login});
  }
}
