export type User = {
  id: string
  username: string
  nickname: string
  email: string
  passwordHash: string
  interests: string[]
  createdAt: Date
}

export type AuthUser = {
  id: string
  username: string
  nickname: string
  email: string
  interests: string[]
}
