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

  async function handleDelete() {
    setIsDeleting(true)

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    })

    setIsDeleting(false)

    if (!response.ok) {
      return
    }

    router.push(`/r/${subredditName}`)
    router.refresh()
  }

  return (
    <button
      type='button'
      disabled={isDeleting}
      onClick={handleDelete}
      className='rounded-full border border-danger/24 bg-danger/6 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-60'
    >
      {isDeleting ? '삭제 중...' : '삭제'}
    </button>
  )
}
