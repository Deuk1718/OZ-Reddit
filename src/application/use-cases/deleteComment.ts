import { isValidCommentId } from '@/domain/rules/commentRules'

import type { CommentRepository } from '@/application/repositories/CommentRepository'

import {
  CommentAuthorizationError,
  CommentNotFoundError,
} from './commentErrors'

export type DeleteCommentRequest = {
  commentId: string
  requesterId: string | null
}

type DeleteCommentDependencies = {
  commentRepository: CommentRepository
}

export async function deleteComment(
  input: DeleteCommentRequest,
  dependencies: DeleteCommentDependencies
): Promise<void> {
  if (!input.requesterId) {
    throw new CommentAuthorizationError('댓글 삭제는 로그인 후 이용할 수 있습니다.')
  }

  if (!isValidCommentId(input.commentId)) {
    throw new CommentNotFoundError('댓글을 찾을 수 없습니다.')
  }

  const comment = await dependencies.commentRepository.findById(input.commentId)

  if (!comment) {
    throw new CommentNotFoundError('댓글을 찾을 수 없습니다.')
  }

  if (comment.authorId !== input.requesterId) {
    throw new CommentAuthorizationError('본인 댓글만 삭제할 수 있습니다.')
  }

  await dependencies.commentRepository.delete(comment.id)
}
