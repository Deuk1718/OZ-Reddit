import CredentialsProvider from 'next-auth/providers/credentials'

import type { NextAuthOptions } from 'next-auth'

import { authenticateUser } from '@/application/use-cases/authenticateUser'
import { PrismaUserRepository } from '@/infrastructure/db/repositories/PrismaUserRepository'

type CredentialsInput = {
  email: string
  password: string
}

function isCredentialsInput(value: unknown): value is CredentialsInput {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return typeof candidate.email === 'string' && typeof candidate.password === 'string'
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: '이메일',
          type: 'email',
        },
        password: {
          label: '비밀번호',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!isCredentialsInput(credentials)) {
          return null
        }

        try {
          const userRepository = new PrismaUserRepository()
          const user = await authenticateUser(
            {
              email: credentials.email,
              password: credentials.password,
            },
            { userRepository }
          )

          return {
            id: user.id,
            name: user.nickname,
            email: user.email,
            username: user.username,
            nickname: user.nickname,
            interests: user.interests,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.username = user.username
        token.nickname = user.nickname
        token.interests = user.interests
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.username = token.username ?? ''
        session.user.nickname = token.nickname ?? ''
        session.user.interests = token.interests ?? []
      }

      return session
    },
  },
}
