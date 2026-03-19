'use client'

import { useState } from 'react'

import type { Comment } from '@/domain/entities/Comment'

import { formatRelativeTime } from '@/lib/formatRelativeTime'

import { CommentComposer } from './CommentComposer'
import { DeleteCommentButton } from './DeleteCommentButton'
import { VoteButton } from '../feed/VoteButton'

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
      <div className='magic-card rounded-xl p-8 text-center border-dashed'>
        <p className='text-slate-400 text-sm'>No arcane responses yet. Be the first to scribe.</p>
      </div>
    )
  }

  return (
    <div className='space-y-8 pl-2'>
      {comments.map((comment) => (
        <div key={comment.id} className='relative flex gap-4'>
          {/* Main Comment Avatar */}
          <div className='w-10 h-10 rounded-full bg-background border border-accent/30 flex-shrink-0 flex items-center justify-center'>
            <span className='material-symbols-outlined text-accent text-xl'>person</span>
          </div>

          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='font-bold text-sm'>u/{comment.authorUsername ?? 'unknown'}</span>
              <span className='text-[10px] text-slate-500 uppercase tracking-widest font-bold'>Traveler</span>
              <span className='text-xs text-slate-400'>• {formatRelativeTime(comment.createdAt)}</span>
            </div>
            
            <p className='text-sm text-slate-300 leading-relaxed'>{comment.body}</p>
            
            <div className='flex items-center gap-4 mt-3 text-xs text-slate-400'>
              <VoteButton
                targetType='comment'
                targetId={comment.id}
                initialScore={comment.score}
                initialVote={comment.currentUserVote}
              />
              <button 
                className='hover:text-accent transition-colors font-medium flex items-center gap-1'
                onClick={() => setOpenReplyId((current) => (current === comment.id ? null : comment.id))}
              >
                <span className='material-symbols-outlined text-sm'>reply</span>
                Reply
              </button>
              {currentUserId === comment.authorId && (
                <DeleteCommentButton commentId={comment.id} />
              )}
            </div>

            {openReplyId === comment.id && (
              <div className='mt-4 bg-background/30 p-4 rounded-xl border border-accent/10'>
                <CommentComposer
                  postId={postId}
                  parentId={comment.id}
                  submitLabel='Scribe Reply'
                  placeholder='Write your arcane response...'
                  cancelLabel='Cancel'
                  onCancel={() => setOpenReplyId(null)}
                />
              </div>
            )}

            {/* Nested Replies Container */}
            {comment.replies.length > 0 && (
              <div className='mt-6 relative pl-6'>
                {/* Yellow Brick Road / Thread line */}
                <div className='absolute left-0 top-0 bottom-0 thread-line rounded-full'></div>
                
                <div className='space-y-6'>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className='relative flex gap-4'>
                      {/* Reply Avatar */}
                      <div className='w-8 h-8 rounded-full bg-background border border-secondary/30 flex-shrink-0 flex items-center justify-center'>
                        <span className='material-symbols-outlined text-xs text-secondary'>person</span>
                      </div>
                      
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='font-bold text-sm text-slate-200'>u/{reply.authorUsername ?? 'unknown'}</span>
                          <span className='text-xs text-slate-400'>• {formatRelativeTime(reply.createdAt)}</span>
                        </div>
                        <p className='text-sm text-slate-300 leading-relaxed'>{reply.body}</p>
                        <div className='flex items-center gap-4 mt-2 text-xs text-slate-400'>
                          <VoteButton
                            targetType='comment'
                            targetId={reply.id}
                            initialScore={reply.score}
                            initialVote={reply.currentUserVote}
                          />
                          {currentUserId === reply.authorId && (
                            <DeleteCommentButton commentId={reply.id} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
