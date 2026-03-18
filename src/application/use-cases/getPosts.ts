import type { Post } from '@/domain/entities/Post'
import type { PostRepository } from '@/application/repositories/PostRepository'

export type PostSort = 'hot' | 'new'

export type GetPostsInput = {
  sort?: string
  subredditName?: string
  cursor?: string
  take?: number
}

export type GetPostsResult = {
  posts: Post[]
  nextCursor: string | null
}

type GetPostsDependencies = {
  postRepository: PostRepository
}

const DEFAULT_TAKE = 10

function parseSort(sort?: string): PostSort {
  return sort === 'new' ? 'new' : 'hot'
}

function parseOffset(cursor?: string): number {
  if (!cursor) {
    return 0
  }

  const offset = Number.parseInt(cursor, 10)
  return Number.isNaN(offset) || offset < 0 ? 0 : offset
}

function calculateHotScore(post: Post, now: number): number {
  const hoursSinceCreation = Math.max(
    0,
    (now - post.createdAt.getTime()) / (1000 * 60 * 60)
  )

  return post.score / Math.pow(hoursSinceCreation + 2, 1.5)
}

export async function getPosts(
  input: GetPostsInput,
  dependencies: GetPostsDependencies
): Promise<GetPostsResult> {
  const take = input.take ?? DEFAULT_TAKE
  const sort = parseSort(input.sort)
  const offset = parseOffset(input.cursor)
  const posts = await dependencies.postRepository.getAll(input.subredditName)
  const now = Date.now()

  const sortedPosts = [...posts].sort((left, right) => {
    if (sort === 'new') {
      return right.createdAt.getTime() - left.createdAt.getTime()
    }

    return calculateHotScore(right, now) - calculateHotScore(left, now)
  })

  const paginatedPosts = sortedPosts.slice(offset, offset + take)
  const nextCursor =
    offset + take < sortedPosts.length ? String(offset + take) : null

  return {
    posts: paginatedPosts,
    nextCursor,
  }
}
