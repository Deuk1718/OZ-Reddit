import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { deleteComment } from '@/application/use-cases/deleteComment'
import {
  CommentAuthorizationError,
  CommentNotFoundError,
} from '@/application/use-cases/commentErrors'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaCommentRepository } from '@/infrastructure/db/repositories/PrismaCommentRepository'

type DeleteCommentRouteProps = {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(_request: Request, { params }: DeleteCommentRouteProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  try {
    const commentRepository = new PrismaCommentRepository()
    await deleteComment(
      {
        commentId: id,
        requesterId: session?.user?.id ?? null,
      },
      { commentRepository }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof CommentNotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      )
    }

    if (error instanceof CommentAuthorizationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { message: '댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
