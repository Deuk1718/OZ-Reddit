import { isValidPostId } from '@/domain/rules/postRules'

import type { Comment } from '@/domain/entities/Comment'
import type { CommentRepository } from '@/application/repositories/CommentRepository'
import type { PostRepository } from '@/application/repositories/PostRepository'

import { CommentNotFoundError } from './commentErrors'

export type GetCommentsRequest = {
  postId: string
}

type GetCommentsDependencies = {
  commentRepository: CommentRepository
  postRepository: PostRepository
}

export async function getComments(
  input: GetCommentsRequest,
  dependencies: GetCommentsDependencies
): Promise<Comment[]> {
  if (!isValidPostId(input.postId)) {
    throw new CommentNotFoundError('게시글을 찾을 수 없습니다.')
  }

  const post = await dependencies.postRepository.findById(input.postId)

  if (!post) {
    throw new CommentNotFoundError('게시글을 찾을 수 없습니다.')
  }

  return dependencies.commentRepository.getByPostId(post.id)
}
