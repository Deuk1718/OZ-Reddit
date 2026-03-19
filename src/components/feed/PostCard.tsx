import Link from 'next/link'

import type { CurrentVoteValue } from '@/domain/entities/Vote'

import { VoteButton } from '@/components/feed/VoteButton'

export type PostCardProps = {
  postId: string
  title: string
  excerpt: string
  author: string
  subreddit: string
  createdAt: string
  score: number
  currentUserVote: CurrentVoteValue
  commentCount: number
  href: string
  category?: string
  isFeatured?: boolean
  isLarge?: boolean
}

export function PostCard({
  postId,
  title,
  excerpt,
  author,
  subreddit,
  createdAt,
  score,
  currentUserVote,
  commentCount,
  href,
  category,
  isFeatured = false,
  isLarge = false,
}: PostCardProps) {
  const featured = isFeatured || isLarge

  return (
    <article className={`magic-card rounded-2xl overflow-hidden group ${featured ? 'border-l-4 border-l-accent' : ''}`}>
      <div className='p-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='size-6 rounded-full bg-emerald-500'></div>
          <span className='text-xs font-bold text-slate-200'>z/{subreddit}</span>
          <span className='text-xs text-slate-500'>• Posted by u/{author} • {createdAt}</span>
        </div>
        <div className='flex items-center gap-3'>
          {category ? (
            <span className='rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent'>
              {category}
            </span>
          ) : null}
          <button className='text-slate-500 hover:text-accent'><span className='material-symbols-outlined'>more_horiz</span></button>
        </div>
      </div>

      <div className='px-4 pb-2'>
        <Link href={href}>
          <h3 className='text-xl font-bold text-slate-100 group-hover:text-accent transition-colors leading-tight'>
            {title}
          </h3>
        </Link>
        <p className='text-sm text-slate-400 mt-1 line-clamp-3 leading-relaxed'>
          {excerpt}
        </p>
      </div>

      {featured && (
        <div className='relative h-64 w-full bg-accent/5 mt-2'>
          <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent'></div>
          <div className='w-full h-full flex items-center justify-center opacity-20'>
             <span className='material-symbols-outlined text-6xl'>image</span>
          </div>
        </div>
      )}

      <div className='p-4 flex items-center gap-6'>
        <VoteButton
          targetType='post'
          targetId={postId}
          initialScore={score}
          initialVote={currentUserVote}
        />
        <Link href={href} className='flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100'>
          <span className='material-symbols-outlined text-lg'>chat_bubble</span> {commentCount} Comments
        </Link>
        <button className='flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100'>
          <span className='material-symbols-outlined text-lg'>share</span> Share
        </button>
      </div>
    </article>
  )
}
