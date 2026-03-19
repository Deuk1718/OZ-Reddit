'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type DeletePostButtonProps = {
  postId: string
  subredditName: string
}

export function DeletePostButton({ postId, subredditName }: DeletePostButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDelete() {
    setErrorMessage(null)
    setIsDeleting(true)

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    })

    setIsDeleting(false)

    if (!response.ok) {
      const json = await response.json().catch(() => null)
      setErrorMessage(json?.message ?? '게시글 삭제 중 오류가 발생했습니다.')
      return
    }

    router.push(`/r/${subredditName}`)
    router.refresh()
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        type='button'
        disabled={isDeleting}
        onClick={handleDelete}
        title={isDeleting ? '삭제 중...' : '삭제'}
        className='w-10 h-10 rounded-full bg-background border border-danger/20 flex items-center justify-center hover:bg-danger/20 group disabled:cursor-not-allowed disabled:opacity-60 transition-colors'
      >
        <span className='material-symbols-outlined text-danger text-[18px]'>delete</span>
      </button>
      {errorMessage ? <p className='text-xs text-danger text-center'>{errorMessage}</p> : null}
    </div>
  )
}
