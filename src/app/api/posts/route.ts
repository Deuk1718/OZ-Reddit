import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { createPost } from '@/application/use-cases/createPost'
import { getPosts } from '@/application/use-cases/getPosts'
import {
  PostAuthorizationError,
  PostValidationError,
} from '@/application/use-cases/postErrors'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'
import { PrismaSubredditRepository } from '@/infrastructure/db/repositories/PrismaSubredditRepository'

type CreatePostRequestBody = {
  title?: string
  body?: string
  subredditName?: string
}

function isCreatePostRequestBody(value: unknown): value is CreatePostRequestBody {
  return typeof value === 'object' && value !== null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sort = searchParams.get('sort') ?? undefined
  const subreddit = searchParams.get('subreddit') ?? undefined
  const cursor = searchParams.get('cursor') ?? undefined
  const takeParam = searchParams.get('take')
  const take = takeParam ? Number.parseInt(takeParam, 10) : undefined

  const postRepository = new PrismaPostRepository()
  const result = await getPosts(
    {
      sort,
      subredditName: subreddit,
      cursor,
      take: Number.isNaN(take ?? NaN) ? undefined : take,
    },
    { postRepository }
  )

  return NextResponse.json(result, { status: 200 })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const body = await request.json().catch(() => null)

  if (!isCreatePostRequestBody(body)) {
    return NextResponse.json(
      { message: '요청 본문이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  try {
    const postRepository = new PrismaPostRepository()
    const subredditRepository = new PrismaSubredditRepository()
    const post = await createPost(
      {
        title: body.title ?? '',
        body: body.body ?? '',
        subredditName: body.subredditName ?? '',
        authorId: session?.user?.id ?? null,
      },
      { postRepository, subredditRepository }
    )

    return NextResponse.json({ post }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof PostValidationError) {
      return NextResponse.json(
        {
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: 400 }
      )
    }

    if (error instanceof PostAuthorizationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      )
    }

    console.error(error)

    return NextResponse.json(
      { message: '게시글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
