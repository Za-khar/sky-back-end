import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm'
import { Topic } from './topic.entity'
import { Comment } from './comment.entity'
import { ArticleLike } from './articleLike.entity'

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  title: string

  @Column({ length: 1000 })
  text: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToMany(() => Topic, (topic) => topic.articles)
  @JoinTable({ name: 'article_topics_list' })
  topics: Topic[]

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[]

  @OneToMany(() => ArticleLike, (articleLike) => articleLike.article)
  articleLikes: ArticleLike[]
}
