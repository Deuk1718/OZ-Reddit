import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPosts } from '@/application/use-cases/getPosts'
import { FeedPagination } from '@/components/feed/FeedPagination'
import { getSubredditByName } from '@/application/use-cases/getSubredditByName'
import { PostCard } from '@/components/feed/PostCard'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'
import { PrismaSubredditRepository } from '@/infrastructure/db/repositories/PrismaSubredditRepository'
import { formatRelativeTime } from '@/lib/formatRelativeTime'

type SubredditFeedPageProps = {
  params: Promise<{
    name: string
  }>
  searchParams: Promise<{
    sort?: string
    cursor?: string
  }>
}

export default async function SubredditFeedPage({
  params,
  searchParams,
}: SubredditFeedPageProps) {
  const { name } = await params
  const resolvedSearchParams = await searchParams
  const subredditRepository = new PrismaSubredditRepository()
  const postRepository = new PrismaPostRepository()
  const subreddit = await getSubredditByName(name, { subredditRepository }).catch(
    () => null
  )
  const sort = resolvedSearchParams.sort === 'new' ? 'new' : 'hot'
  const cursor = resolvedSearchParams.cursor
  const { posts, nextCursor } = await getPosts(
    {
      sort,
      subredditName: name,
      cursor,
    },
    { postRepository }
  )

  if (!subreddit) {
    notFound()
  }

  return (
    <div className='flex w-full flex-col gap-8 pb-8'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]'>
        <div className='relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-8 shadow-[0_22px_70px_rgba(40,13,140,0.12)] sm:px-8'>
          <div className='absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(74,48,242,0.2),transparent_42%),radial-gradient(circle_at_top_right,rgba(236,242,48,0.14),transparent_34%)]' />
          <div className='relative'>
            <p className='inline-flex rounded-full border border-accent/20 bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong'>
              Subreddit Feed
            </p>
            <h1 className='mt-6 font-display text-5xl tracking-[-0.05em] text-deep sm:text-6xl'>
              r/{name}
            </h1>
            <p className='mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base'>
              {subreddit.description ?? '아직 설명이 등록되지 않은 새 커뮤니티입니다.'}
            </p>
            <div className='mt-7 flex flex-wrap items-center gap-3'>
              <span className='rounded-full bg-highlight-soft px-4 py-2 text-sm font-semibold text-deep'>
                {subreddit.memberCount} members
              </span>
              <Link
                href={`/r/${name}/submit`}
                className='rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong'
              >
                이 커뮤니티에 글 쓰기
              </Link>
            </div>
          </div>
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-deep px-6 py-6 text-white shadow-[0_24px_60px_rgba(40,13,140,0.2)]'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-highlight'>
              Community Mood
            </p>
            <h2 className='mt-4 font-display text-3xl tracking-[-0.04em]'>읽고 싶은 글의 톤</h2>
            <ul className='mt-6 space-y-3 text-sm leading-7 text-white/72'>
              <li className='rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3'>
                맥락이 짧고 분명한 질문형 글
              </li>
              <li className='rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3'>
                실제 시도와 배운 점이 포함된 회고형 글
              </li>
              <li className='rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3'>
                피드백 요청이 구체적인 토론형 글
              </li>
            </ul>
          </div>

          <div className='rounded-[2rem] border border-border bg-surface px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Feed Controls
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Link
                href={`/r/${name}?sort=hot`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sort === 'hot'
                    ? 'bg-accent text-white'
                    : 'border border-border bg-surface-strong text-deep hover:border-accent hover:text-accent'
                }`}
              >
                Hot
              </Link>
              <Link
                href={`/r/${name}?sort=new`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sort === 'new'
                    ? 'bg-accent text-white'
                    : 'border border-border bg-surface-strong text-deep hover:border-accent hover:text-accent'
                }`}
              >
                New
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_18px_48px_rgba(40,13,140,0.1)] sm:px-8'>
        <div className='flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Community Posts
            </p>
            <h2 className='mt-3 font-display text-4xl tracking-[-0.04em] text-deep'>
              r/{name} 피드
            </h2>
          </div>
          <Link
            href='/'
            className='text-sm font-semibold text-accent transition hover:text-accent-strong'
          >
            홈 피드로 돌아가기
          </Link>
        </div>

        <div className='mt-6 space-y-4'>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.body ?? '본문이 없는 텍스트 게시글입니다.'}
                author={post.authorUsername ?? 'unknown'}
                subreddit={post.subredditName}
                createdAt={formatRelativeTime(post.createdAt)}
                score={post.score}
                commentCount={post.commentCount}
                category={index === 0 && sort === 'hot' ? 'Editor Pick' : 'Community Post'}
                href={`/r/${post.subredditName}/${post.id}`}
                isFeatured={index === 0 && sort === 'hot'}
              />
            ))
          ) : (
            <article className='rounded-[1.6rem] border border-dashed border-border bg-surface-strong p-6'>
              <p className='text-sm font-semibold text-deep'>아직 게시글이 없습니다.</p>
              <p className='mt-3 text-sm leading-7 text-muted'>
                M03에서 실제 게시글 생성 기능이 연결되면 이 커뮤니티의 글 목록이 여기에
                표시됩니다.
              </p>
              <Link
                href={`/r/${name}/submit`}
                className='mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong'
              >
                첫 게시글 작성하기
              </Link>
            </article>
          )}
        </div>

        <FeedPagination
          basePath={`/r/${name}`}
          sort={sort}
          currentCursor={cursor}
          nextCursor={nextCursor}
        />
      </section>
    </div>
  )
}
