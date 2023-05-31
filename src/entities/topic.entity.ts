import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm'
import { Article } from './article.entity'
import { User } from './user.entity'

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToMany(() => Article, (article) => article.topics, { onDelete: 'CASCADE' })
  articles: Article[]

  @ManyToMany(() => User, (user) => user.topics, { onDelete: 'CASCADE' })
  users: User[]
}
