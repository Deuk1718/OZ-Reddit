import { isValidPostId } from '@/domain/rules/postRules'
import {
  MAX_COMMENT_REPLY_DEPTH,
  normalizeCommentBody,
  validateCommentBody,
} from '@/domain/rules/commentRules'

import type { Comment } from '@/domain/entities/Comment'
import type { CommentRepository } from '@/application/repositories/CommentRepository'
import type { PostRepository } from '@/application/repositories/PostRepository'

import {
  CommentAuthorizationError,
  CommentNotFoundError,
  CommentValidationError,
} from './commentErrors'

export type CreateCommentRequest = {
  body: string
  authorId: string | null
  postId: string
  parentId: string | null
}

type CreateCommentDependencies = {
  commentRepository: CommentRepository
  postRepository: PostRepository
}

export async function createComment(
  input: CreateCommentRequest,
  dependencies: CreateCommentDependencies
): Promise<Comment> {
  if (!input.authorId) {
    throw new CommentAuthorizationError('댓글 작성은 로그인 후 이용할 수 있습니다.')
  }

  if (!isValidPostId(input.postId)) {
    throw new CommentNotFoundError('게시글을 찾을 수 없습니다.')
  }

  const body = normalizeCommentBody(input.body)
  const bodyError = validateCommentBody(body)

  if (bodyError) {
    throw new CommentValidationError('댓글 내용을 다시 확인해 주세요.', {
      body: bodyError,
    })
  }

  const post = await dependencies.postRepository.findById(input.postId)

  if (!post) {
    throw new CommentNotFoundError('게시글을 찾을 수 없습니다.')
  }

  let parentId: string | null = null

  if (input.parentId) {
    const parentComment = await dependencies.commentRepository.findById(input.parentId)

    if (!parentComment || parentComment.postId !== post.id) {
      throw new CommentNotFoundError('부모 댓글을 찾을 수 없습니다.')
    }

    if (parentComment.parentId) {
      throw new CommentValidationError(
        `${MAX_COMMENT_REPLY_DEPTH}단계까지만 답글을 작성할 수 있습니다.`,
        {
          parentId: '대댓글에는 다시 답글을 달 수 없습니다.',
        }
      )
    }

    parentId = parentComment.id
  }

  return dependencies.commentRepository.create({
    body,
    authorId: input.authorId,
    postId: post.id,
    parentId,
  })
}
