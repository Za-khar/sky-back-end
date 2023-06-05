import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Topic } from './topic.entity'
import { Comment } from './comment.entity'
import { ArticleLike } from './articleLike.entity'
import { User } from './user.entity'

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  title: string

  @Column({ length: 100000 })
  text: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Comment, (comment) => comment.article, { cascade: true })
  comments: Comment[]

  @OneToMany(() => ArticleLike, (articleLike) => articleLike.article, { cascade: true })
  articleLikes: ArticleLike[]

  // many - one
  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  // many - many
  @ManyToMany(() => Topic, (topic) => topic.articles, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'article_topics_list' })
  topics: Topic[]

  @ManyToMany(() => User, (user) => user.savedArticles)
  savedByUsers: User[]
}
