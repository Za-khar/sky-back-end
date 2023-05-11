import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { RefreshToken } from './refreshToken.entity'
import { ArticleLike } from './articleLike.entity'

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

  @Column({ nullable: true, length: 255 })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { cascade: true })
  refreshTokens: RefreshToken[]

  @OneToMany(() => ArticleLike, (articleLike) => articleLike.user)
  articleLikes: ArticleLike[]
}
