export interface UpdateMyProfileRequestBody {
  login?: string
  password?: string
  oldPassword?: string
  name?: string
  surname?: string
  description?: string
  avatar?: string
}

export interface GetUserByIdRequestParams {
  userId?: string
}
