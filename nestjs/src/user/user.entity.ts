import { ArticleEntity } from "../task/article.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @OneToMany(() => ArticleEntity, (article) => article.user)
  articles: ArticleEntity[];
}