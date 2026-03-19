'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/subreddits', label: '탐색', icon: 'explore' },
  { href: '/popular', label: '트렌딩', icon: 'trending_up' },
  { href: '/login', label: '프로필', icon: 'person' },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className='glass-nav fixed bottom-0 left-0 right-0 z-30 lg:hidden'>
      <div className='flex items-center justify-around px-2 py-2'>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition ${
                isActive ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              <span className='material-symbols-outlined text-[22px]'>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
