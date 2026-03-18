import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/infrastructure/auth/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  return NextResponse.json(
    {
      user: {
        id: session.user.id,
        email: session.user.email ?? null,
        username: session.user.username ?? null,
        nickname: session.user.nickname ?? null,
        interests: session.user.interests ?? [],
      },
    },
    { status: 200 }
  )
}
