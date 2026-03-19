import type { Post } from '@/domain/entities/Post'
import type { PostRepository } from '@/application/repositories/PostRepository'

import { isValidPostId } from '@/domain/rules/postRules'

import { PostNotFoundError } from './postErrors'

type GetPostByIdDependencies = {
  postRepository: PostRepository
  viewerUserId?: string
}

export async function getPostById(
  id: string,
  dependencies: GetPostByIdDependencies
): Promise<Post> {
  if (!isValidPostId(id)) {
    throw new PostNotFoundError('게시글을 찾을 수 없습니다.')
  }

  const post = await dependencies.postRepository.findById(id, dependencies.viewerUserId)

  if (!post) {
    throw new PostNotFoundError('게시글을 찾을 수 없습니다.')
  }

  return post
}
