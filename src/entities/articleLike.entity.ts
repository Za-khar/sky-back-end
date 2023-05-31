import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Article } from './article.entity'

@Entity()
export class ArticleLike {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.articleLikes)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Article, (article) => article.articleLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: Article
}
