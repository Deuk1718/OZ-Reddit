import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { createSubreddit } from '@/application/use-cases/createSubreddit'
import { getSubreddits } from '@/application/use-cases/getSubreddits'
import {
  SubredditAuthorizationError,
  SubredditConflictError,
  SubredditValidationError,
} from '@/application/use-cases/subredditErrors'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaSubredditRepository } from '@/infrastructure/db/repositories/PrismaSubredditRepository'

type CreateSubredditRequestBody = {
  name?: string
  description?: string
}

function isCreateSubredditRequestBody(
  value: unknown
): value is CreateSubredditRequestBody {
  return typeof value === 'object' && value !== null
}

export async function GET() {
  const subredditRepository = new PrismaSubredditRepository()
  const subreddits = await getSubreddits({ subredditRepository })

  return NextResponse.json({ subreddits }, { status: 200 })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const body = await request.json().catch(() => null)

  if (!isCreateSubredditRequestBody(body)) {
    return NextResponse.json(
      { message: '요청 본문이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  try {
    const subredditRepository = new PrismaSubredditRepository()
    const subreddit = await createSubreddit(
      {
        name: body.name ?? '',
        description: body.description ?? '',
        creatorId: session?.user?.id ?? null,
      },
      { subredditRepository }
    )

    return NextResponse.json({ subreddit }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof SubredditValidationError) {
      return NextResponse.json(
        {
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: 400 }
      )
    }

    if (error instanceof SubredditConflictError) {
      return NextResponse.json(
        {
          message: error.message,
          field: error.field,
        },
        { status: 409 }
      )
    }

    if (error instanceof SubredditAuthorizationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: '서브레딧 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
