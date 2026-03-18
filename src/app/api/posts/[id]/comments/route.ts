import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { createComment } from '@/application/use-cases/createComment'
import { getComments } from '@/application/use-cases/getComments'
import {
  CommentAuthorizationError,
  CommentNotFoundError,
  CommentValidationError,
} from '@/application/use-cases/commentErrors'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaCommentRepository } from '@/infrastructure/db/repositories/PrismaCommentRepository'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'

type CommentRouteProps = {
  params: Promise<{
    id: string
  }>
}

type CreateCommentRequestBody = {
  body?: string
  parentId?: string | null
}

function isCreateCommentRequestBody(value: unknown): value is CreateCommentRequestBody {
  return typeof value === 'object' && value !== null
}

export async function GET(_request: Request, { params }: CommentRouteProps) {
  const { id } = await params

  try {
    const commentRepository = new PrismaCommentRepository()
    const postRepository = new PrismaPostRepository()
    const comments = await getComments(
      {
        postId: id,
      },
      { commentRepository, postRepository }
    )

    return NextResponse.json({ comments }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof CommentNotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: '댓글 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: CommentRouteProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const body = await request.json().catch(() => null)

  if (!isCreateCommentRequestBody(body)) {
    return NextResponse.json(
      { message: '요청 본문이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  try {
    const commentRepository = new PrismaCommentRepository()
    const postRepository = new PrismaPostRepository()
    const comment = await createComment(
      {
        body: body.body ?? '',
        parentId: body.parentId ?? null,
        postId: id,
        authorId: session?.user?.id ?? null,
      },
      { commentRepository, postRepository }
    )

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof CommentValidationError) {
      return NextResponse.json(
        {
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: 400 }
      )
    }

    if (error instanceof CommentAuthorizationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    if (error instanceof CommentNotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: '댓글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
