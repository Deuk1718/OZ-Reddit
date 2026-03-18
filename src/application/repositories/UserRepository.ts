import type { User } from '@/domain/entities/User'

export type CreateUserInput = {
  email: string
  username: string
  nickname: string
  passwordHash: string
  interests: string[]
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
}
