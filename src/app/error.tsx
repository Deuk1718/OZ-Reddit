'use client'

import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex min-h-[70vh] items-center justify-center px-4'>
      <div className='glass-card max-w-md w-full rounded-2xl p-10 text-center space-y-6'>
        <div className='relative mx-auto size-24'>
          <div className='absolute inset-0 rounded-full bg-red-500/20 blur-xl' />
          <div className='relative flex size-24 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30'>
            <span className='material-symbols-outlined text-5xl text-red-400'>error</span>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-xs font-semibold uppercase tracking-widest text-red-400'>오류 발생</p>
          <h1 className='text-3xl font-bold text-deep'>마법이 풀렸어요</h1>
          <p className='text-sm leading-7 text-muted'>
            예상치 못한 문제가 발생했습니다.
            다시 시도하거나 잠시 후 돌아오세요.
          </p>
          {error.digest && (
            <p className='text-xs text-muted/50'>오류 코드: {error.digest}</p>
          )}
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
          <button
            onClick={reset}
            className='btn-gradient px-6 py-3 text-center text-sm'
          >
            다시 시도
          </button>
          <a
            href='/'
            className='rounded-full border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent'
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
