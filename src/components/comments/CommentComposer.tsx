'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CommentComposerProps = {
  postId: string
  parentId?: string
  submitLabel: string
  placeholder: string
  cancelLabel?: string
  onCancel?: () => void
}

type CommentFieldErrors = {
  body?: string
}

export function CommentComposer({
  postId,
  parentId,
  submitLabel,
  placeholder,
  cancelLabel,
  onCancel,
}: CommentComposerProps) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [fieldErrors, setFieldErrors] = useState<CommentFieldErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        body,
        parentId: parentId ?? null,
      }),
    })

    const json = await response.json().catch(() => null)
    setIsSubmitting(false)

    if (!response.ok) {
      setFieldErrors({
        body: json?.fieldErrors?.body,
      })
      setSubmitError(json?.message ?? '댓글 작성 중 오류가 발생했습니다.')
      return
    }

    setBody('')
    setFieldErrors({})
    setSubmitError('')
    onCancel?.()
    router.refresh()
  }

  return (
    <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(event) => {
          setBody(event.target.value)
          setFieldErrors({})
          setSubmitError('')
        }}
        placeholder={placeholder}
        rows={parentId ? 3 : 4}
        className='min-h-[120px] rounded-[1.5rem] border border-border bg-background px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-accent focus:bg-surface'
      />
      {fieldErrors.body ? <p className='text-sm text-danger'>{fieldErrors.body}</p> : null}
      {submitError ? <p className='text-sm text-danger'>{submitError}</p> : null}
      <div className='flex flex-wrap gap-3'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.22)] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
        {onCancel && cancelLabel ? (
          <button
            type='button'
            onClick={onCancel}
            className='rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
          >
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </form>
  )
}
