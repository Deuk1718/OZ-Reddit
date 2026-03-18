'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      type='button'
      onClick={() => void signOut({ callbackUrl: '/' })}
      className='rounded-full border border-secondary px-4 py-2 text-sm font-medium text-deep transition hover:bg-secondary hover:text-white'
    >
      로그아웃
    </button>
  )
}
