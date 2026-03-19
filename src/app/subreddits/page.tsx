import Link from 'next/link'

import { getSubreddits } from '@/application/use-cases/getSubreddits'
import { PrismaSubredditRepository } from '@/infrastructure/db/repositories/PrismaSubredditRepository'

type CommunityTrack = {
  label: string
  value: string
  icon: string
}

const communityTracks: CommunityTrack[] = [
  { label: 'Design', value: '08 active spaces', icon: 'palette' },
  { label: 'Build', value: '14 active spaces', icon: 'construction' },
  { label: 'Culture', value: '06 active spaces', icon: 'diversity_3' },
  { label: 'Startups', value: '11 active spaces', icon: 'rocket_launch' },
]

export default async function SubredditsPage() {
  const subredditRepository = new PrismaSubredditRepository()
  const subreddits = await getSubreddits({ subredditRepository })

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_340px]'>
        <div className='glass-card relative overflow-hidden px-6 py-8 sm:px-8'>
          <div className='absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(159,31,239,0.2),transparent_42%),radial-gradient(circle_at_top_right,rgba(0,242,255,0.12),transparent_32%)]' />
          <div className='relative'>
            <p className='inline-flex rounded-full bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-accent'>
              Community Directory
            </p>
            <h1 className='mt-6 max-w-3xl text-4xl font-bold tracking-tight text-deep sm:text-5xl'>
              관심사에 맞는 커뮤니티를 먼저 찾고, 그다음 대화에 들어갑니다
            </h1>
            <p className='mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base'>
              OZ-Reddit의 서브레딧 목록은 단순한 카테고리 나열이 아니라, 큐레이션된
              탐색 경험을 제공하는 것을 목표로 합니다.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/subreddits/create'
                className='btn-gradient px-6 py-3 text-center text-sm'
              >
                새 커뮤니티 만들기
              </Link>
              <Link
                href='/register'
                className='rounded-full border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent'
              >
                가입 후 맞춤 추천 받기
              </Link>
            </div>
          </div>
        </div>

        <aside className='glass-card px-6 py-6'>
          <p className='text-[11px] font-semibold uppercase tracking-widest text-secondary'>
            Browse Tracks
          </p>
          <h2 className='mt-4 text-2xl font-bold tracking-tight text-deep'>주요 탐색 트랙</h2>
          <div className='mt-6 space-y-3'>
            {communityTracks.map((track) => (
              <article
                key={track.label}
                className='glass-card-strong flex items-center gap-3 px-4 py-4'
              >
                <span className='material-symbols-outlined text-[20px] text-secondary'>{track.icon}</span>
                <div>
                  <p className='text-sm font-semibold text-foreground'>{track.label}</p>
                  <p className='mt-1 text-sm text-muted'>{track.value}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className='glass-card px-6 py-7 sm:px-8'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-accent'>
              Featured Picks
            </p>
            <h2 className='mt-3 text-3xl font-bold tracking-tight text-deep'>
              추천 커뮤니티
            </h2>
          </div>
          <p className='max-w-md text-sm leading-6 text-muted'>
            멤버 수, 최신 활동 기준으로 정렬됩니다.
          </p>
        </div>

        <div className='mt-8 grid gap-4'>
          {subreddits.length > 0 ? (
            subreddits.map((subreddit) => (
              <Link
                key={subreddit.id}
                href={`/r/${subreddit.name}`}
                className='magic-card rounded-2xl p-5 block cursor-pointer'
              >
                <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                  <div className='max-w-2xl'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <span className='text-xl font-semibold tracking-tight text-deep transition hover:text-accent'>
                        z/{subreddit.name}
                      </span>
                      <span className='flex items-center gap-1 rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-secondary'>
                        <span className='material-symbols-outlined text-[14px]'>group</span>
                        {subreddit.memberCount} members
                      </span>
                    </div>
                    <p className='mt-3 text-sm leading-7 text-muted'>
                      {subreddit.description ?? '아직 소개 문구가 등록되지 않았습니다.'}
                    </p>
                  </div>

                  <div className='flex flex-wrap gap-2 md:max-w-[240px] md:justify-end'>
                    <span className='rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent'>
                      {subreddit.postCount} posts
                    </span>
                    <span className='rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent'>
                      u/{subreddit.creatorUsername ?? 'unknown'}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <article className='glass-card border-dashed p-6'>
              <p className='text-sm font-semibold text-deep'>아직 생성된 서브레딧이 없습니다.</p>
              <p className='mt-3 text-sm leading-7 text-muted'>
                첫 커뮤니티를 만들어 탐색 흐름을 시작해 보세요.
              </p>
              <Link
                href='/subreddits/create'
                className='btn-gradient mt-5 inline-flex px-5 py-3 text-sm'
              >
                첫 서브레딧 만들기
              </Link>
            </article>
          )}
        </div>
      </section>
    </div>
  )
}
