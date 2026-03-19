'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { SignOutButton } from '@/components/auth/SignOutButton'

const navigationItems = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/subreddits', label: 'Communities', icon: 'groups' },
]

export function AppHeader() {
  const { data: session } = useSession()

  return (
    <nav className='glass-nav sticky top-0 z-50 px-6 py-3'>
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-2 text-accent'>
            <span className='material-symbols-outlined text-3xl'>auto_awesome</span>
            <h2 className='text-xl font-bold tracking-tight text-slate-100'>OZ-Reddit</h2>
          </Link>
          <div className='hidden md:flex items-center gap-6'>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='text-sm font-medium text-slate-300 hover:text-accent transition-colors flex items-center gap-2'
              >
                <span className='material-symbols-outlined text-[18px]'>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className='hidden md:block mx-8 flex-1 max-w-md'>
          <div className='relative group'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors'>search</span>
            <input
              className='w-full bg-accent/10 border border-accent/20 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-slate-500 outline-none text-slate-100'
              placeholder='Search the Yellow Brick Road...'
              type='text'
            />
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {session ? (
            <>
              <button className='p-2 rounded-full hover:bg-accent/20 text-slate-300 transition-colors hidden sm:block'>
                <span className='material-symbols-outlined'>notifications</span>
              </button>
              <button className='p-2 rounded-full hover:bg-accent/20 text-slate-300 transition-colors hidden sm:block'>
                <span className='material-symbols-outlined'>chat_bubble</span>
              </button>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 rounded-full bg-gradient-to-tr from-accent to-purple-400 p-0.5'>
                  <div className='h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden'>
                    {session.user?.image ? (
                      <img src={session.user.image} alt='User avatar' className='w-full h-full object-cover' />
                    ) : (
                      <span className='material-symbols-outlined text-slate-400'>person</span>
                    )}
                  </div>
                </div>
                <SignOutButton />
              </div>
            </>
          ) : (
            <div className='flex items-center gap-4'>
              <Link
                href='/login'
                className='text-sm font-bold text-slate-300 hover:text-white transition-colors'
              >
                Log In
              </Link>
              <Link
                href='/register'
                className='bg-accent hover:bg-accent-strong text-white text-sm font-bold px-6 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(159,31,239,0.3)]'
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
