import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Article } from './article.entity'

@Entity()
export class ArticleLike {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.articleLikes)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Article, (article) => article.articleLikes)
  @JoinColumn({ name: 'articleId' })
  article: Article

  @Column()
  isLiked: boolean
}
