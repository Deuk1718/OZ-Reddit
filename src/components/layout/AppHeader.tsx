import Link from 'next/link'

const navigationItems = [
  { href: '/', label: '홈' },
  { href: '/subreddits', label: '커뮤니티' },
  { href: '/popular', label: '트렌딩' },
  { href: '/about', label: '가이드' },
]

export async function AppHeader() {
  return (
    <header className='sticky top-0 z-30 border-b border-border/80 bg-surface/80 backdrop-blur-xl'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-6 lg:gap-8'>
          <Link href='/' className='flex items-center gap-3 text-deep'>
            <span className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/20 bg-deep text-sm font-semibold text-highlight shadow-[0_12px_24px_rgba(40,13,140,0.18)]'>
              OZ
            </span>
            <span>
              <span className='block text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
                Community Edition
              </span>
              <span className='font-display text-2xl tracking-tight'>OZ-Reddit</span>
            </span>
          </Link>
          <nav className='hidden items-center gap-3 rounded-full border border-border bg-surface-strong/90 p-2 md:flex'>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-white hover:text-deep'
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-3'>
          <div className='hidden rounded-full border border-accent/12 bg-accent-soft px-4 py-2 text-sm font-medium text-deep xl:flex'>
            Curated communities and live threads
          </div>
          <Link
            href='/login'
            className='rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
          >
            로그인
          </Link>
          <Link
            href='/register'
            className='rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong'
          >
            커뮤니티 시작
          </Link>
        </div>
      </div>
    </header>
  )
}
