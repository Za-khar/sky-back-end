import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { RefreshToken } from './refreshToken.entity'
import { ArticleLike } from './articleLike.entity'
import { Topic } from './topic.entity'
import { CommentLike } from './commentLike.entity'
import { Comment } from './comment.entity'
import { Article } from './article.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 16 })
  login: string

  @Column()
  password: string

  @Column({ length: 50 })
  name: string

  @Column({ length: 50 })
  surname: string

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true, length: 255 })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { cascade: true })
  refreshTokens: RefreshToken[]

  @OneToMany(() => Article, (article) => article.user, { cascade: true })
  articles: Article[]

  @OneToMany(() => ArticleLike, (articleLike) => articleLike.user)
  articleLikes: ArticleLike[]

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
  commentLikes: CommentLike[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]

  @ManyToMany(() => Topic, (topic) => topic.users, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'user_topics_list' })
  topics: Topic[]

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({ name: 'user_followers_list', joinColumn: { name: 'userId' }, inverseJoinColumn: { name: 'followerId' } })
  following: User[]

  @ManyToMany(() => User, (user) => user.following)
  followers: User[]

  @ManyToMany(() => Article, (article) => article.savedByUsers)
  @JoinTable({ name: 'user_articles_list' })
  savedArticles: Article[]
}
