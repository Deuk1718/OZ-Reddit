import {
  normalizePostBody,
  normalizePostTitle,
  validatePostBody,
  validatePostTitle,
} from '@/domain/rules/postRules'

import type { Post } from '@/domain/entities/Post'
import type { PostRepository } from '@/application/repositories/PostRepository'
import type { SubredditRepository } from '@/application/repositories/SubredditRepository'

import {
  PostAuthorizationError,
  PostValidationError,
} from './postErrors'

export type CreatePostRequest = {
  title: string
  body: string
  authorId: string | null
  subredditName: string
}

type CreatePostDependencies = {
  postRepository: PostRepository
  subredditRepository: SubredditRepository
}

export async function createPost(
  input: CreatePostRequest,
  dependencies: CreatePostDependencies
): Promise<Post> {
  if (!input.authorId) {
    throw new PostAuthorizationError('게시글 작성은 로그인 후 이용할 수 있습니다.')
  }

  const title = normalizePostTitle(input.title)
  const body = normalizePostBody(input.body)

  const fieldErrors = {
    title: validatePostTitle(title),
    body: validatePostBody(body),
  }

  const filteredFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, value]) => value !== null)
  ) as Record<string, string>

  if (Object.keys(filteredFieldErrors).length > 0) {
    throw new PostValidationError('게시글 정보를 다시 확인해 주세요.', filteredFieldErrors)
  }

  const subreddit = await dependencies.subredditRepository.findByName(input.subredditName)

  if (!subreddit) {
    throw new PostValidationError('서브레딧을 찾을 수 없습니다.', {
      subredditName: '유효한 서브레딧을 선택해 주세요.',
    })
  }

  return dependencies.postRepository.create({
    title,
    body: body.length > 0 ? body : null,
    authorId: input.authorId,
    subredditName: subreddit.name,
  })
}
