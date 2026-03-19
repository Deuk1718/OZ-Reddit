import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { deletePost } from '@/application/use-cases/deletePost'
import { getPostById } from '@/application/use-cases/getPostById'
import {
  PostAuthorizationError,
  PostNotFoundError,
} from '@/application/use-cases/postErrors'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'

type PostRouteProps = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, { params }: PostRouteProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  try {
    const postRepository = new PrismaPostRepository()
    const post = await getPostById(id, {
      postRepository,
      viewerUserId: session?.user?.id,
    })

    return NextResponse.json({ post }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof PostNotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: '게시글 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: PostRouteProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  try {
    const postRepository = new PrismaPostRepository()
    await deletePost(
      {
        postId: id,
        requesterId: session?.user?.id ?? null,
      },
      { postRepository }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof PostNotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      )
    }

    if (error instanceof PostAuthorizationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { message: '게시글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
