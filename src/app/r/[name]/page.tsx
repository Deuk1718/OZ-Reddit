import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

import { getPosts } from '@/application/use-cases/getPosts'
import { getSubredditByName } from '@/application/use-cases/getSubredditByName'
import { FeedPagination } from '@/components/feed/FeedPagination'
import { PostCard } from '@/components/feed/PostCard'
import { authOptions } from '@/infrastructure/auth/authOptions'
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
  const session = await getServerSession(authOptions)
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
      viewerUserId: session?.user?.id,
    },
    { postRepository }
  )

  if (!subreddit) {
    notFound()
  }

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px]'>
        <div className='glass-card relative overflow-hidden px-6 py-8 sm:px-8'>
          <div className='absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(159,31,239,0.2),transparent_42%),radial-gradient(circle_at_top_right,rgba(0,242,255,0.12),transparent_34%)]' />
          <div className='relative'>
            <p className='inline-flex rounded-full bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-accent'>
              Sub-OZ Feed
            </p>
            <h1 className='mt-6 text-4xl font-bold tracking-tight text-deep sm:text-5xl'>
              z/{name}
            </h1>
            <p className='mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base'>
              {subreddit.description ?? '아직 설명이 등록되지 않은 새 커뮤니티입니다.'}
            </p>
            <div className='mt-7 flex flex-wrap items-center gap-3'>
              <span className='flex items-center gap-1 rounded-full bg-secondary-soft px-4 py-2 text-sm font-semibold text-secondary'>
                <span className='material-symbols-outlined text-[16px]'>group</span>
                {subreddit.memberCount} members
              </span>
              <Link
                href={`/r/${name}/submit`}
                className='btn-gradient inline-flex items-center gap-2 px-5 py-3 text-sm'
              >
                <span className='material-symbols-outlined text-[16px]'>edit</span>
                이 커뮤니티에 글 쓰기
              </Link>
            </div>
          </div>
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='glass-card px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-secondary'>
              Community Mood
            </p>
            <h2 className='mt-4 text-2xl font-bold tracking-tight text-deep'>읽고 싶은 글의 톤</h2>
            <ul className='mt-6 space-y-3 text-sm leading-7 text-muted'>
              <li className='glass-card-strong px-4 py-3'>
                맥락이 짧고 분명한 질문형 글
              </li>
              <li className='glass-card-strong px-4 py-3'>
                실제 시도와 배운 점이 포함된 회고형 글
              </li>
              <li className='glass-card-strong px-4 py-3'>
                피드백 요청이 구체적인 토론형 글
              </li>
            </ul>
          </div>

          <div className='glass-card px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-accent'>
              Feed Controls
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Link
                href={`/r/${name}?sort=hot`}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sort === 'hot'
                    ? 'btn-gradient'
                    : 'border border-border text-foreground hover:border-accent hover:text-accent'
                }`}
              >
                <span className='material-symbols-outlined text-[16px]'>local_fire_department</span>
                Hot
              </Link>
              <Link
                href={`/r/${name}?sort=new`}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sort === 'new'
                    ? 'btn-gradient'
                    : 'border border-border text-foreground hover:border-accent hover:text-accent'
                }`}
              >
                <span className='material-symbols-outlined text-[16px]'>schedule</span>
                New
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className='glass-card px-6 py-7 sm:px-8'>
        <div className='flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-accent'>
              Community Posts
            </p>
            <h2 className='mt-3 text-3xl font-bold tracking-tight text-deep'>
              z/{name} 피드
            </h2>
          </div>
          <Link
            href='/'
            className='flex items-center gap-1 text-sm font-semibold text-accent transition hover:text-secondary'
          >
            <span className='material-symbols-outlined text-[16px]'>arrow_back</span>
            홈 피드로 돌아가기
          </Link>
        </div>

        <div className='mt-6 space-y-4'>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                postId={post.id}
                title={post.title}
                excerpt={post.body ?? '본문이 없는 텍스트 게시글입니다.'}
                author={post.authorUsername ?? 'unknown'}
                subreddit={post.subredditName}
                createdAt={formatRelativeTime(post.createdAt)}
                score={post.score}
                currentUserVote={post.currentUserVote}
                commentCount={post.commentCount}
                category={index === 0 && sort === 'hot' ? 'Editor Pick' : 'Community Post'}
                href={`/r/${post.subredditName}/${post.id}`}
                isFeatured={index === 0 && sort === 'hot'}
              />
            ))
          ) : (
            <article className='glass-card border-dashed p-6'>
              <p className='text-sm font-semibold text-deep'>아직 게시글이 없습니다.</p>
              <p className='mt-3 text-sm leading-7 text-muted'>
                첫 게시글이 작성되면 이 커뮤니티의 글 목록이 여기에 표시됩니다.
              </p>
              <Link
                href={`/r/${name}/submit`}
                className='btn-gradient mt-5 inline-flex px-5 py-3 text-sm'
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
