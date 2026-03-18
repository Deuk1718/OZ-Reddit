import type { Post } from '@/domain/entities/Post'
import type { PostRepository } from '@/application/repositories/PostRepository'

import { PostNotFoundError } from './postErrors'

type GetPostByIdDependencies = {
  postRepository: PostRepository
}

export async function getPostById(
  id: string,
  dependencies: GetPostByIdDependencies
): Promise<Post> {
  const post = await dependencies.postRepository.findById(id)

  if (!post) {
    throw new PostNotFoundError('게시글을 찾을 수 없습니다.')
  }

  return post
}
