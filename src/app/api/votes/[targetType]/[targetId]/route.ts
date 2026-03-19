import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { removeVote } from '@/application/use-cases/removeVote'
import {
  VoteAuthorizationError,
  VoteNotFoundError,
  VoteValidationError,
} from '@/application/use-cases/voteErrors'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaVoteRepository } from '@/infrastructure/db/repositories/PrismaVoteRepository'

type DeleteVoteRouteProps = {
  params: Promise<{
    targetType: string
    targetId: string
  }>
}

export async function DELETE(
  _request: Request,
  { params }: DeleteVoteRouteProps
) {
  const { targetType, targetId } = await params
  const session = await getServerSession(authOptions)

  try {
    const voteRepository = new PrismaVoteRepository()
    const result = await removeVote(
      {
        userId: session?.user?.id ?? null,
        targetType,
        targetId,
      },
      { voteRepository }
    )

    return NextResponse.json(
      {
        deleted: result.deleted,
        score: result.score,
        currentVote: result.currentVote,
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
      { message: '투표 취소 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
