import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Comment } from './comment.entity'

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.commentLikes)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Comment, (comment) => comment.commentLikes)
  @JoinColumn({ name: 'commentId' })
  comment: Comment
}
