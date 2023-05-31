declare namespace Express {
  export interface Request {
    userId: string
    user: {
      id: string
      login: string
      avatar: string
      password: string
      name: string
      surname: string
      description?: string
      createdAt: Date
      updatedAt: Date
    }
  }
}
