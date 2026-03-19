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
    if (!body.trim()) return
    
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
      setSubmitError(json?.message ?? 'Failed to scribe your message.')
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
        className='w-full bg-background/50 border border-accent/20 rounded-lg p-3 text-sm focus:ring-secondary focus:border-secondary resize-none outline-none text-slate-100 placeholder:text-slate-500 transition-all'
      />
      {fieldErrors.body ? <p className='text-xs text-danger ml-1'>{fieldErrors.body}</p> : null}
      {submitError ? <p className='text-xs text-danger ml-1'>{submitError}</p> : null}
      <div className='flex justify-end gap-3'>
        {onCancel && cancelLabel && (
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-slate-200 transition-all'
          >
            {cancelLabel}
          </button>
        )}
        <button
          type='submit'
          disabled={isSubmitting || !body.trim()}
          className='bg-accent hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-full text-sm font-bold transition-all text-white'
        >
          {isSubmitting ? 'Scribing...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
