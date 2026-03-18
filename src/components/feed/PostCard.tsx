import Link from 'next/link'

export type PostCardProps = {
  title: string
  excerpt: string
  author: string
  subreddit: string
  createdAt: string
  score: number
  commentCount: number
  category: string
  href: string
  isFeatured?: boolean
}

export function PostCard({
  title,
  excerpt,
  author,
  subreddit,
  createdAt,
  score,
  commentCount,
  category,
  href,
  isFeatured = false,
}: PostCardProps) {
  return (
    <article
      className={`rounded-[1.75rem] border border-border bg-surface p-5 transition hover:border-accent/30 hover:shadow-[0_20px_50px_rgba(40,13,140,0.1)] sm:p-6 ${
        isFeatured ? 'bg-[linear-gradient(180deg,rgba(118,99,242,0.08),rgba(255,255,255,1))]' : ''
      }`}
    >
      <div className='flex flex-col gap-5 md:flex-row md:items-start'>
        <div className='flex min-w-[72px] flex-row items-center gap-3 md:flex-col md:items-center'>
          <button
            type='button'
            className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-strong text-sm font-semibold text-muted transition hover:border-accent hover:text-accent'
            aria-label='추천'
          >
            ▲
          </button>
          <div className='text-center'>
            <p className='text-lg font-semibold tracking-tight text-deep'>{score}</p>
            <p className='text-[11px] uppercase tracking-[0.2em] text-muted'>score</p>
          </div>
          <button
            type='button'
            className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-strong text-sm font-semibold text-muted transition hover:border-accent hover:text-accent'
            aria-label='비추천'
          >
            ▼
          </button>
        </div>

        <div className='flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='rounded-full bg-highlight-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-deep'>
              {category}
            </span>
            <span className='rounded-full border border-accent/14 bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong'>
              r/{subreddit}
            </span>
          </div>

          <Link href={href} className='group mt-4 block'>
            <h3 className='text-2xl font-semibold leading-9 tracking-tight text-deep transition group-hover:text-accent'>
              {title}
            </h3>
            <p className='mt-3 max-w-3xl text-sm leading-7 text-muted'>{excerpt}</p>
          </Link>

          <div className='mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted'>
            <span className='font-medium text-foreground'>u/{author}</span>
            <span>{createdAt}</span>
            <span>{commentCount} comments</span>
          </div>
        </div>
      </div>
    </article>
  )
}
