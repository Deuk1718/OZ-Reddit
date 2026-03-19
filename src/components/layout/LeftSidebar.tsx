import Link from 'next/link'

const feedMenuItems = [
  { href: '/', label: 'Home', icon: 'home', active: true },
  { href: '/?sort=hot', label: 'Popular', icon: 'trending_up' },
  { href: '/subreddits', label: 'All', icon: 'language' },
]

type LeftSidebarProps = {
  recentCommunities?: { name: string; color?: string }[]
}

export function LeftSidebar({ recentCommunities = [] }: LeftSidebarProps) {
  return (
    <aside className='hidden lg:block lg:col-span-2 space-y-6'>
      <div className='space-y-2'>
        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest px-4'>Feeds</p>
        <nav className='flex flex-col gap-1'>
          {feedMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                item.active 
                ? 'bg-accent/20 text-accent font-bold' 
                : 'text-slate-400 hover:bg-accent/10 hover:text-slate-100'
              }`}
            >
              <span className='material-symbols-outlined'>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className='space-y-2'>
        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest px-4'>Recent Communities</p>
        <nav className='flex flex-col gap-1'>
          {recentCommunities.length > 0 ? (
            recentCommunities.map((community) => (
              <Link
                key={community.name}
                href={`/r/${community.name}`}
                className='flex min-w-0 items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:bg-accent/10 hover:text-slate-100 transition-all'
              >
                <div className={`shrink-0 size-6 rounded-md flex items-center justify-center text-xs font-bold ${community.color || 'bg-accent/20 text-accent'}`}>
                  {community.name.substring(0, 2).toUpperCase()}
                </div>
                <span className='truncate'>z/{community.name}</span>
              </Link>
            ))
          ) : (
            <Link
              href='/subreddits'
              className='flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:bg-accent/10 hover:text-slate-100 transition-all'
            >
              <span className='material-symbols-outlined'>explore</span>
              Explore
            </Link>
          )}
        </nav>
      </div>
      
      <div className='space-y-2'>
        <p className='text-xs font-bold text-slate-500 uppercase tracking-widest px-4'>Create</p>
        <Link
          href='/subreddits/create'
          className='flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:bg-accent/10 hover:text-slate-100 transition-all'
        >
          <span className='material-symbols-outlined'>add_circle</span>
          New Sub-OZ
        </Link>
      </div>
    </aside>
  )
}
