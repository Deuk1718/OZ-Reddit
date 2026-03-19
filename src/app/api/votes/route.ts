import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { castVote } from '@/application/use-cases/castVote'
import {
  VoteAuthorizationError,
  VoteNotFoundError,
  VoteValidationError,
} from '@/application/use-cases/voteErrors'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaVoteRepository } from '@/infrastructure/db/repositories/PrismaVoteRepository'

type CastVoteRequestBody = {
  targetType?: string
  targetId?: string
  value?: number
}

function isCastVoteRequestBody(value: unknown): value is CastVoteRequestBody {
  return typeof value === 'object' && value !== null
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const body = await request.json().catch(() => null)

  if (!isCastVoteRequestBody(body)) {
    return NextResponse.json(
      { message: '요청 본문이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  try {
    const voteRepository = new PrismaVoteRepository()
    const result = await castVote(
      {
        userId: session?.user?.id ?? null,
        targetType: body.targetType ?? '',
        targetId: body.targetId ?? '',
        value: body.value ?? 0,
      },
      { voteRepository }
    )

    return NextResponse.json(
      {
        score: result.score,
        currentVote: result.vote.value,
        vote: result.vote,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    if (error instanceof VoteValidationError) {
      return NextResponse.json(
        {
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: 400 }
      )
    }

    if (error instanceof VoteAuthorizationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    if (error instanceof VoteNotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      )
    }

    console.error(error)

    return NextResponse.json(
      { message: '투표 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
