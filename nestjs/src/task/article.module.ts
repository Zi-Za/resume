import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { ArticleController } from '@app/task/article.controller';
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), TypeOrmModule.forFeature([UserEntity]), PassportModule],

  controllers: [ArticleController],
  providers: [ArticleService, JwtStrategy]
})
export class UserModule {}
  