import { UserEntity } from "@app/user/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({type: 'timestamp'})
  createdAt: number;

  @Column({type: 'timestamp'})
  updatedAt: number;

  @BeforeUpdate()
  updateTimestamp(){
    this.updatedAt = Date.now();
  }

  @ManyToOne(() => UserEntity, (user) => user.articles)
  user: Omit<UserEntity, 'password'>;
}