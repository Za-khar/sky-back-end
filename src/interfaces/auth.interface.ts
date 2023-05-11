export interface RegisterRequestBody {
  login: string
  password: string
  name: string
  surname: string
  description?: string
}

export interface LoginRequestBody {
  login: string
  password: string
}

export interface RefreshRequestBody {
  refreshToken: string
}
