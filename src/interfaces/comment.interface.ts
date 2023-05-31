import { PaginationQuery } from './common.interface'

export interface CreateCommentRequestBody {
  articleId: string
  content: string
}

export interface GetCommentsRequestQuery extends PaginationQuery {
  articleId?: string
}
