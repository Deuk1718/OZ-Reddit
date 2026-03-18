import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    username: string
    nickname: string
    interests: string[]
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string
      username: string
      nickname: string
      interests: string[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub?: string
    username?: string
    nickname?: string
    interests?: string[]
  }
}

export {}
