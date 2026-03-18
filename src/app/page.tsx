import Link from 'next/link'

import { getPosts } from '@/application/use-cases/getPosts'
import { FeedPagination } from '@/components/feed/FeedPagination'
import { PostCard } from '@/components/feed/PostCard'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'
import { formatRelativeTime } from '@/lib/formatRelativeTime'

type HomePageProps = {
  searchParams: Promise<{
    sort?: string
    cursor?: string
  }>
}

const feedSignals = [
  { label: 'Live threads', value: '34' },
  { label: 'Active writers', value: '142' },
  { label: 'Fresh posts', value: '12' },
]

const trendingCommunities = [
  {
    name: 'r/designcrit',
    members: '12.4k members',
    description: '제품과 브랜드 시안을 빠르게 리뷰하고 구체적인 피드백을 주고받는 공간',
  },
  {
    name: 'r/sidebuild',
    members: '8.1k members',
    description: '실험 로그, 런칭 전 검증, 회고 공유에 특화된 빌더 중심 커뮤니티',
  },
  {
    name: 'r/k-startup',
    members: '21.9k members',
    description: '국내 초기 팀의 운영 경험과 실전 인사이트가 모이는 로컬 허브',
  },
]

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams
  const sort = params.sort === 'new' ? 'new' : 'hot'
  const cursor = params.cursor
  const postRepository = new PrismaPostRepository()
  const { posts, nextCursor } = await getPosts(
    {
      sort,
      cursor,
    },
    { postRepository }
  )

  return (
    <div className='flex w-full flex-col gap-8 pb-8'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]'>
        <div className='relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-8 shadow-[0_30px_80px_var(--color-shadow)] sm:px-8 sm:py-10'>
          <div className='absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(74,48,242,0.22),transparent_44%),radial-gradient(circle_at_top_right,rgba(118,99,242,0.18),transparent_36%)]' />
          <div className='relative'>
            <div className='inline-flex rounded-full border border-accent/20 bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong'>
              Community Feed Preview
            </div>
            <h1 className='mt-6 max-w-4xl font-display text-5xl leading-[1.02] tracking-[-0.04em] text-deep sm:text-6xl'>
              홈에서 바로 읽고 참여할 수 있는 커뮤니티 피드 구조
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg'>
              OZ-Reddit의 첫 화면은 설명보다 피드 경험이 먼저 보이도록 설계합니다.
              사용자는 정렬 바, 포스트 카드, 우측 맥락 패널을 통해 커뮤니티의 속도와
              밀도를 바로 체감할 수 있어야 합니다.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/register'
                className='rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_32px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong'
              >
                커뮤니티 참여 시작
              </Link>
              <Link
                href='/subreddits'
                className='rounded-full border border-border bg-surface-strong px-6 py-3 text-center text-sm font-semibold text-deep transition hover:border-secondary hover:text-secondary'
              >
                추천 커뮤니티 둘러보기
              </Link>
            </div>
            <div className='mt-10 grid gap-3 sm:grid-cols-3'>
              {feedSignals.map((signal) => (
                <article
                  key={signal.label}
                  className='rounded-[1.5rem] border border-border bg-background/72 p-4'
                >
                  <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-muted'>
                    {signal.label}
                  </p>
                  <p className='mt-3 text-3xl font-semibold tracking-tight text-deep'>
                    {signal.value}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-deep px-6 py-6 text-white shadow-[0_24px_60px_rgba(40,13,140,0.28)]'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-highlight'>
              Trending Communities
            </p>
            <h2 className='mt-4 font-display text-3xl tracking-[-0.04em]'>
              지금 많이 머무는 커뮤니티
            </h2>
            <div className='mt-6 space-y-4'>
              {trendingCommunities.map((community) => (
                <article
                  key={community.name}
                  className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4'
                >
                  <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/55'>
                    {community.members}
                  </p>
                  <h3 className='mt-2 text-lg font-semibold leading-7'>{community.name}</h3>
                  <p className='mt-3 text-sm text-white/60'>{community.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className='rounded-[2rem] border border-border bg-surface px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-muted'>
              Why This Layout
            </p>
            <p className='mt-4 text-base leading-7 text-muted'>
              피드만 강조하지 않고, 발견과 맥락을 함께 보여주는 구조를 통해 커뮤니티의
              밀도는 유지하면서도 첫 진입 장벽을 낮췄습니다.
            </p>
          </div>
        </aside>
      </section>

      <section className='grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_340px]'>
        <div className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_18px_48px_var(--color-shadow)] sm:px-8'>
          <div className='flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
                Home Feed
              </p>
              <h2 className='mt-3 font-display text-4xl tracking-[-0.04em] text-deep'>
                지금 읽기 좋은 포스트
              </h2>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Link
                href='/?sort=hot'
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sort === 'hot'
                    ? 'bg-accent text-white'
                    : 'border border-border bg-surface-strong text-deep hover:border-accent hover:text-accent'
                }`}
              >
                Hot
              </Link>
              <Link
                href='/?sort=new'
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sort === 'new'
                    ? 'bg-accent text-white'
                    : 'border border-border bg-surface-strong text-deep hover:border-accent hover:text-accent'
                }`}
              >
                New
              </Link>
              <button
                type='button'
                className='rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
              >
                Rising
              </button>
            </div>
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
                  첫 게시글이 작성되면 홈 피드에서 바로 확인할 수 있습니다.
                </p>
              </article>
            )}
          </div>

          <FeedPagination
            basePath='/'
            sort={sort}
            currentCursor={cursor}
            nextCursor={nextCursor}
          />
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-surface px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Feed Rules
            </p>
            <h2 className='mt-3 font-display text-3xl tracking-[-0.04em] text-deep'>
              PostCard 설계 기준
            </h2>
            <ul className='mt-6 space-y-4 text-sm leading-7 text-muted'>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                제목, 서브레딧, 작성자, 시간, 점수, 댓글 수가 한 카드 안에서 바로 스캔돼야 합니다.
              </li>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                투표 영역은 눈에 띄되 콘텐츠를 가리지 않도록 분리된 세로 블록으로 유지합니다.
              </li>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                실제 M03에서는 이 카드 구조 위에 링크, 정렬, 페이지네이션이 그대로 연결됩니다.
              </li>
            </ul>
          </div>

          <div className='rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(236,242,48,0.22),rgba(255,255,255,0.96))] px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Next Step
            </p>
            <p className='mt-4 text-base leading-7 text-deep'>
              다음 단계에서는 이 PostCard를 기준으로 `r/[name]` 피드와 게시글 상세 진입
              흐름을 연결하면 M03 화면 설계가 훨씬 빨라집니다.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
