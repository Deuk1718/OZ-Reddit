import Link from 'next/link'

type FeaturedCommunity = {
  name: string
  members: string
  description: string
  tone: string
}

type TrendingPost = {
  category: string
  title: string
  meta: string
}

type CommunitySignal = {
  label: string
  value: string
  detail: string
}

const featuredCommunities: FeaturedCommunity[] = [
  {
    name: 'r/designcrit',
    members: '12.4k members',
    description: '제품, 브랜딩, UI 시안을 빠르게 공유하고 서로 구체적인 피드백을 주고받는 공간',
    tone: '피드백이 빠른 아트 디렉션 허브',
  },
  {
    name: 'r/sidebuild',
    members: '8.1k members',
    description: '사이드 프로젝트 진행기와 런칭 전 검증 포인트를 정리하는 빌더 중심 커뮤니티',
    tone: '빌드 로그와 검증 루프에 강한 채널',
  },
  {
    name: 'r/k-startup',
    members: '21.9k members',
    description: '국내 스타트업과 초기 제품 팀이 시장 감각, 운영 경험, 툴링을 공유하는 네트워크',
    tone: '정보 밀도 높은 로컬 인사이트 피드',
  },
]

const trendingPosts: TrendingPost[] = [
  {
    category: '오늘의 토론',
    title: '온보딩 첫 화면에서 브랜드 감도와 정보 구조를 같이 챙기려면 무엇부터 정리해야 할까?',
    meta: '128 comments · 3시간 전',
  },
  {
    category: '인기 가이드',
    title: '커뮤니티 피드에서 카드형 레이아웃이 리스트형보다 유리한 순간들',
    meta: '84 comments · 5시간 전',
  },
  {
    category: '운영 인사이트',
    title: '초기 서브레딧의 품질을 유지하면서도 참여 장벽은 낮추는 운영 방식',
    meta: '62 comments · 8시간 전',
  },
]

const communitySignals: CommunitySignal[] = [
  {
    label: 'Curated Communities',
    value: '34',
    detail: '관심사별 큐레이션 섹션',
  },
  {
    label: 'Live Discussions',
    value: '142',
    detail: '실시간 반응이 붙는 주제',
  },
  {
    label: 'Weekly Prompts',
    value: '12',
    detail: '운영팀이 제안하는 대화 시작점',
  },
]

export default function Home() {
  return (
    <div className='flex w-full flex-col gap-8 pb-8'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]'>
        <div className='relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-8 shadow-[0_30px_80px_var(--color-shadow)] sm:px-8 sm:py-10'>
          <div className='absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(74,48,242,0.22),transparent_44%),radial-gradient(circle_at_top_right,rgba(118,99,242,0.18),transparent_36%)]' />
          <div className='relative'>
            <div className='inline-flex rounded-full border border-accent/20 bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong'>
              Structured Community Experience
            </div>
            <h1 className='mt-6 max-w-4xl font-display text-5xl leading-[1.02] tracking-[-0.04em] text-deep sm:text-6xl'>
              깊이 있는 대화를 더 읽기 쉬운 구조로 정리한 커뮤니티 홈
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg'>
              OZ-Reddit는 빠르게 흘러가는 게시글 피드 위에 큐레이션, 서브레딧 발견,
              운영 가이드를 함께 배치해 처음 들어온 사용자도 길을 잃지 않도록 설계합니다.
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
              {communitySignals.map((signal) => (
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
                  <p className='mt-2 text-sm leading-6 text-muted'>{signal.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-deep px-6 py-6 text-white shadow-[0_24px_60px_rgba(40,13,140,0.28)]'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-highlight'>
              Editorial Queue
            </p>
            <h2 className='mt-4 font-display text-3xl tracking-[-0.04em]'>
              오늘 주목할 대화
            </h2>
            <div className='mt-6 space-y-4'>
              {trendingPosts.map((post) => (
                <article
                  key={post.title}
                  className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4'
                >
                  <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/55'>
                    {post.category}
                  </p>
                  <h3 className='mt-2 text-lg font-semibold leading-7'>{post.title}</h3>
                  <p className='mt-3 text-sm text-white/60'>{post.meta}</p>
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

      <section className='grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]'>
        <div className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_18px_48px_var(--color-shadow)] sm:px-8'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-muted'>
                Featured Communities
              </p>
              <h2 className='mt-3 font-display text-4xl tracking-[-0.04em] text-deep'>
                추천 서브레딧
              </h2>
            </div>
            <p className='max-w-md text-sm leading-6 text-muted'>
              큐레이션된 커뮤니티를 먼저 보여주고 이후 전체 피드로 연결하는 흐름을
              기본값으로 제안합니다.
            </p>
          </div>

          <div className='mt-8 grid gap-4'>
            {featuredCommunities.map((community) => (
              <article
                key={community.name}
                className='grid gap-4 rounded-[1.75rem] border border-border bg-surface-strong p-5 transition hover:border-secondary/45 hover:bg-background/84 md:grid-cols-[minmax(0,1fr)_220px]'
              >
                <div>
                  <div className='flex flex-wrap items-center gap-3'>
                    <h3 className='text-xl font-semibold tracking-tight text-deep'>
                      {community.name}
                    </h3>
                    <span className='rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted'>
                      {community.members}
                    </span>
                  </div>
                  <p className='mt-3 max-w-2xl text-sm leading-7 text-muted'>
                    {community.description}
                  </p>
                </div>
                <div className='rounded-[1.4rem] border border-border bg-surface px-4 py-4'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-muted'>
                    Positioning
                  </p>
                  <p className='mt-3 text-sm leading-6 text-deep'>{community.tone}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-surface px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-muted'>
              Launch Guide
            </p>
            <h2 className='mt-3 font-display text-3xl tracking-[-0.04em] text-deep'>
              M00 이후 바로 이어질 화면
            </h2>
            <ul className='mt-6 space-y-4 text-sm leading-7 text-muted'>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                회원가입과 로그인 화면을 동일한 타이포 시스템으로 연결
              </li>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                서브레딧 목록에 큐레이션 헤더와 정렬 바 배치
              </li>
              <li className='rounded-[1.2rem] border border-border bg-surface-strong px-4 py-3'>
                게시글 상세에서 본문과 댓글 영역의 계층을 더 또렷하게 분리
              </li>
            </ul>
          </div>

          <div className='rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(188,145,217,0.22),rgba(253,251,255,0.96))] px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Design Principle
            </p>
            <p className='mt-4 text-base leading-7 text-deep'>
              정보 밀도는 높게 유지하되, 여백과 타이포 계층으로 읽는 속도를 끌어올리는
              방향을 이번 홈 시안의 기준으로 삼았습니다.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
