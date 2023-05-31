import { PaginationQuery } from './common.interface'

export interface CreateArticleRequestBody {
  title: string
  text: string
  topics: Array<string>
}

export interface DeleteArticleRequestParams {
  articleId?: string
}

export interface GetArticlesFilterQuery extends PaginationQuery {
  userId?: string
  topicId?: string
}
export interface GetArticleByIdRequestParams {
  articleId?: string
}

export interface RateArticleRequestBody {
  articleId: string
  isLiked: boolean
}
