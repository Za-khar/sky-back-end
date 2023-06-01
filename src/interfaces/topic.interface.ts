import { PaginationQuery } from './common.interface'

export interface GetAllTopicsRequestQuery extends PaginationQuery {
  userId?: string
}

export interface CreateTopicRequestBody {
  title: string
}

export interface UpdateMyTopicsRequestBody {
  topic: string
  action: 'save' | 'unsave'
}
