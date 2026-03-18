import type { PostRepository } from '@/application/repositories/PostRepository'

import {
  PostAuthorizationError,
  PostNotFoundError,
} from './postErrors'

export type DeletePostRequest = {
  postId: string
  requesterId: string | null
}

type DeletePostDependencies = {
  postRepository: PostRepository
}

export async function deletePost(
  input: DeletePostRequest,
  dependencies: DeletePostDependencies
): Promise<void> {
  if (!input.requesterId) {
    throw new PostAuthorizationError('게시글 삭제는 로그인 후 이용할 수 있습니다.')
  }

  const post = await dependencies.postRepository.findById(input.postId)

  if (!post) {
    throw new PostNotFoundError('게시글을 찾을 수 없습니다.')
  }

  if (post.authorId !== input.requesterId) {
    throw new PostAuthorizationError('본인 게시글만 삭제할 수 있습니다.')
  }

  await dependencies.postRepository.delete(post.id)
}
