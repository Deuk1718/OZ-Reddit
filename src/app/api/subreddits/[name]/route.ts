import { NextResponse } from 'next/server'

import { getSubredditByName } from '@/application/use-cases/getSubredditByName'
import { SubredditNotFoundError } from '@/application/use-cases/subredditErrors'
import { PrismaSubredditRepository } from '@/infrastructure/db/repositories/PrismaSubredditRepository'

type SubredditRouteProps = {
  params: Promise<{
    name: string
  }>
}

export async function GET(_request: Request, { params }: SubredditRouteProps) {
  const { name } = await params

  try {
    const subredditRepository = new PrismaSubredditRepository()
    const subreddit = await getSubredditByName(name, { subredditRepository })

    return NextResponse.json({ subreddit }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof SubredditNotFoundError) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: '서브레딧 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
