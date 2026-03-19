import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-[70vh] items-center justify-center px-4'>
      <div className='glass-card max-w-md w-full rounded-2xl p-10 text-center space-y-6'>
        <div className='relative mx-auto size-24'>
          <div className='absolute inset-0 rounded-full bg-accent/20 blur-xl' />
          <div className='relative flex size-24 items-center justify-center rounded-full bg-accent/10 border border-accent/30'>
            <span className='material-symbols-outlined text-5xl text-accent'>search_off</span>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-xs font-semibold uppercase tracking-widest text-accent'>404</p>
          <h1 className='text-3xl font-bold text-deep'>길을 잃었나요?</h1>
          <p className='text-sm leading-7 text-muted'>
            마법의 나라 OZ에서도 이 페이지는 찾을 수 없었습니다.
            노란 벽돌길을 따라 돌아가 보세요.
          </p>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
          <Link
            href='/'
            className='btn-gradient px-6 py-3 text-center text-sm'
          >
            홈으로 돌아가기
          </Link>
          <Link
            href='/subreddits'
            className='rounded-full border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent'
          >
            커뮤니티 탐색
          </Link>
        </div>
      </div>
    </div>
  )
}
