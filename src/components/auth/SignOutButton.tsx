'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      type='button'
      onClick={() => void signOut({ callbackUrl: '/' })}
      className='flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-danger hover:text-danger'
    >
      <span className='material-symbols-outlined text-[16px]'>logout</span>
      로그아웃
    </button>
  )
}
