export interface PaginationQuery {
  skip?: number
  take?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
  searchTerm?: string
}
