'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type DeleteCommentButtonProps = {
  commentId: string
}

export function DeleteCommentButton({ commentId }: DeleteCommentButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDelete() {
    setErrorMessage(null)
    setIsDeleting(true)

    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    })

    const json = await response.json().catch(() => null)
    setIsDeleting(false)

    if (!response.ok) {
      setErrorMessage(json?.message ?? '댓글 삭제 중 오류가 발생했습니다.')
      return
    }

    router.refresh()
  }

  return (
    <div className='flex flex-col items-start gap-1'>
      <button
        type='button'
        disabled={isDeleting}
        onClick={handleDelete}
        title={isDeleting ? '삭제 중...' : '삭제'}
        className='flex items-center justify-center text-danger transition hover:text-danger/70 disabled:cursor-not-allowed disabled:opacity-60'
      >
        <span className='material-symbols-outlined text-[16px]'>delete</span>
      </button>
      {errorMessage ? <p className='text-xs text-danger'>{errorMessage}</p> : null}
    </div>
  )
}
