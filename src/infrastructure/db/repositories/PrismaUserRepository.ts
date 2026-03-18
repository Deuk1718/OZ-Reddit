import { prisma } from '@/infrastructure/db/prisma'

import type { CreateUserInput, UserRepository } from '@/application/repositories/UserRepository'
import type { User } from '@/domain/entities/User'

function toDomainUser(user: {
  id: string
  username: string
  nickname: string
  email: string
  passwordHash: string
  interests: string[]
  createdAt: Date
}): User {
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    passwordHash: user.passwordHash,
    interests: user.interests,
    createdAt: user.createdAt,
  }
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return user ? toDomainUser(user) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    return user ? toDomainUser(user) : null
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: input,
    })

    return toDomainUser(user)
  }
}
