'use client'

import { useState } from 'react'

import type { Comment } from '@/domain/entities/Comment'

import { formatRelativeTime } from '@/lib/formatRelativeTime'

import { CommentComposer } from './CommentComposer'
import { DeleteCommentButton } from './DeleteCommentButton'

type CommentThreadListProps = {
  comments: Comment[]
  currentUserId: string | null
  postId: string
}

export function CommentThreadList({
  comments,
  currentUserId,
  postId,
}: CommentThreadListProps) {
  const [openReplyId, setOpenReplyId] = useState<string | null>(null)

  if (comments.length === 0) {
    return (
      <div className='rounded-[1.5rem] border border-dashed border-accent/24 bg-accent-soft px-5 py-5'>
        <p className='text-sm font-semibold text-deep'>첫 댓글을 남겨 보세요.</p>
        <p className='mt-2 text-sm leading-7 text-muted'>
          아직 대화가 시작되지 않았습니다. 이 게시글의 첫 번째 의견을 남길 수 있습니다.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {comments.map((comment) => (
        <article
          key={comment.id}
          className='rounded-[1.5rem] border border-border bg-surface-strong px-5 py-5'
        >
          <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted'>
            <span className='font-medium text-foreground'>
              u/{comment.authorUsername ?? 'unknown'}
            </span>
            <span>{formatRelativeTime(comment.createdAt)}</span>
            <span>{comment.score} score</span>
          </div>

          <p className='mt-3 text-sm leading-7 text-foreground'>{comment.body}</p>

          <div className='mt-4 flex flex-wrap items-center gap-4'>
            <button
              type='button'
              onClick={() =>
                setOpenReplyId((current) => (current === comment.id ? null : comment.id))
              }
              className='text-sm font-semibold text-accent transition hover:text-accent-strong'
            >
              답글 달기
            </button>
            {currentUserId === comment.authorId ? (
              <DeleteCommentButton commentId={comment.id} />
            ) : null}
          </div>

          {openReplyId === comment.id ? (
            <div className='mt-4 rounded-[1.25rem] border border-border bg-surface px-4 py-4'>
              <CommentComposer
                postId={postId}
                parentId={comment.id}
                submitLabel='답글 등록'
                placeholder='이 댓글에 대한 답글을 남겨 보세요'
                cancelLabel='취소'
                onCancel={() => setOpenReplyId(null)}
              />
            </div>
          ) : null}

          {comment.replies.length > 0 ? (
            <div className='mt-5 space-y-3 border-l border-accent/18 pl-4 sm:pl-6'>
              {comment.replies.map((reply) => (
                <article
                  key={reply.id}
                  className='rounded-[1.25rem] border border-border bg-surface px-4 py-4'
                >
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted'>
                    <span className='font-medium text-foreground'>
                      u/{reply.authorUsername ?? 'unknown'}
                    </span>
                    <span>{formatRelativeTime(reply.createdAt)}</span>
                    <span>{reply.score} score</span>
                  </div>
                  <p className='mt-3 text-sm leading-7 text-foreground'>{reply.body}</p>
                  {currentUserId === reply.authorId ? (
                    <div className='mt-4'>
                      <DeleteCommentButton commentId={reply.id} />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}
