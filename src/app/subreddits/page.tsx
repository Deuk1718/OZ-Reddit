import Link from 'next/link'

type FeaturedSubreddit = {
  name: string
  members: string
  description: string
  tags: string[]
}

type CommunityTrack = {
  label: string
  value: string
}

const featuredSubreddits: FeaturedSubreddit[] = [
  {
    name: 'r/designcrit',
    members: '12.4k members',
    description: '디자인 리뷰와 브랜드 톤 피드백이 빠르게 오가는 큐레이션 커뮤니티',
    tags: ['UI Review', 'Brand Systems', 'Product Critique'],
  },
  {
    name: 'r/sidebuild',
    members: '8.1k members',
    description: '사이드 프로젝트의 진행 로그, 실험 기록, 런칭 전 검증 노트를 모아보는 공간',
    tags: ['Build Log', 'Validation', 'Launch Notes'],
  },
  {
    name: 'r/k-startup',
    members: '21.9k members',
    description: '국내 초기 팀이 운영 경험과 시장 감각을 나누는 로컬 스타트업 커뮤니티',
    tags: ['Startup Ops', 'Local Insight', 'Growth'],
  },
]

const communityTracks: CommunityTrack[] = [
  { label: 'Design', value: '08 active spaces' },
  { label: 'Build', value: '14 active spaces' },
  { label: 'Culture', value: '06 active spaces' },
  { label: 'Startups', value: '11 active spaces' },
]

export default function SubredditsPage() {
  return (
    <div className='flex w-full flex-col gap-8 pb-8'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]'>
        <div className='relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-8 shadow-[0_22px_70px_rgba(40,13,140,0.12)] sm:px-8'>
          <div className='absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(74,48,242,0.22),transparent_42%),radial-gradient(circle_at_top_right,rgba(236,242,48,0.14),transparent_32%)]' />
          <div className='relative'>
            <p className='inline-flex rounded-full border border-accent/20 bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong'>
              Community Directory
            </p>
            <h1 className='mt-6 max-w-3xl font-display text-5xl tracking-[-0.05em] text-deep sm:text-6xl'>
              관심사에 맞는 커뮤니티를 먼저 찾고, 그다음 대화에 들어갑니다
            </h1>
            <p className='mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base'>
              OZ-Reddit의 서브레딧 목록은 단순한 카테고리 나열이 아니라, 큐레이션된
              탐색 경험을 제공하는 것을 목표로 합니다. 추천 커뮤니티와 테마별 트랙을
              함께 보여줘 처음 들어온 사용자도 빠르게 맥락을 잡을 수 있게 합니다.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/subreddits/create'
                className='rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong'
              >
                새 커뮤니티 만들기
              </Link>
              <Link
                href='/register'
                className='rounded-full border border-border bg-surface-strong px-6 py-3 text-center text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
              >
                가입 후 맞춤 추천 받기
              </Link>
            </div>
          </div>
        </div>

        <aside className='rounded-[2rem] border border-border bg-deep px-6 py-6 text-white shadow-[0_24px_60px_rgba(40,13,140,0.2)]'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-highlight'>
            Browse Tracks
          </p>
          <h2 className='mt-4 font-display text-3xl tracking-[-0.04em]'>주요 탐색 트랙</h2>
          <div className='mt-6 space-y-3'>
            {communityTracks.map((track) => (
              <article
                key={track.label}
                className='rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4'
              >
                <p className='text-sm font-semibold text-white'>{track.label}</p>
                <p className='mt-2 text-sm text-white/68'>{track.value}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]'>
        <div className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_18px_48px_rgba(40,13,140,0.1)] sm:px-8'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
                Featured Picks
              </p>
              <h2 className='mt-3 font-display text-4xl tracking-[-0.04em] text-deep'>
                추천 커뮤니티
              </h2>
            </div>
            <p className='max-w-md text-sm leading-6 text-muted'>
              실제 M02 구현에서는 정렬, 멤버 수, 최신 활동 기준이 이 영역에 연결됩니다.
            </p>
          </div>

          <div className='mt-8 grid gap-4'>
            {featuredSubreddits.map((subreddit) => (
              <article
                key={subreddit.name}
                className='rounded-[1.7rem] border border-border bg-surface-strong p-5 transition hover:border-accent/30 hover:bg-white'
              >
                <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                  <div className='max-w-2xl'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <h3 className='text-2xl font-semibold tracking-tight text-deep'>
                        {subreddit.name}
                      </h3>
                      <span className='rounded-full bg-highlight-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-deep'>
                        {subreddit.members}
                      </span>
                    </div>
                    <p className='mt-3 text-sm leading-7 text-muted'>{subreddit.description}</p>
                  </div>

                  <div className='flex flex-wrap gap-2 md:max-w-[220px] md:justify-end'>
                    {subreddit.tags.map((tag) => (
                      <span
                        key={tag}
                        className='rounded-full border border-accent/14 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-surface px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Design Note
            </p>
            <h2 className='mt-3 font-display text-3xl tracking-[-0.04em] text-deep'>
              목록 페이지 설계 원칙
            </h2>
            <ul className='mt-6 space-y-4 text-sm leading-7 text-muted'>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                추천 커뮤니티와 전체 목록을 분리해 첫 진입의 피로를 줄입니다.
              </li>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                카드형과 리스트형의 중간 밀도로 스캔성과 정보량을 함께 가져갑니다.
              </li>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                실제 데이터 연결 전에도 이후 확장 구조가 보이도록 섹션을 설계합니다.
              </li>
            </ul>
          </div>

          <div className='rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(236,242,48,0.22),rgba(255,255,255,0.96))] px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong'>
              Next Step
            </p>
            <p className='mt-4 text-sm leading-7 text-deep'>
              다음 단계에서는 이 구조에 실제 정렬 바, 검색 입력, 생성 폼 진입 흐름을
              붙이면 M02의 UI 뼈대가 완성됩니다.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
