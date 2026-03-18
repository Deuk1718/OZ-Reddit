'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CreateSubredditFieldErrors = {
  name?: string
  description?: string
}

type CreateSubredditErrorResponse = {
  message?: string
  fieldErrors?: CreateSubredditFieldErrors
  field?: 'name'
}

export function CreateSubredditForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [fieldErrors, setFieldErrors] = useState<CreateSubredditFieldErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    const response = await fetch('/api/subreddits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
      }),
    })

    if (!response.ok) {
      const errorResponse = (await response.json().catch(() => null)) as CreateSubredditErrorResponse | null

      if (errorResponse?.field === 'name' && errorResponse.message) {
        setFieldErrors((current) => ({
          ...current,
          name: errorResponse.message,
        }))
      } else {
        setFieldErrors(errorResponse?.fieldErrors ?? {})
      }

      setSubmitError(errorResponse?.message ?? '서브레딧 생성 중 오류가 발생했습니다.')
      setIsSubmitting(false)
      return
    }

    const data = (await response.json()) as {
      subreddit: {
        name: string
      }
    }

    setIsSubmitting(false)
    router.push(`/r/${data.subreddit.name}`)
    router.refresh()
  }

  return (
    <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2'>
        <label htmlFor='subreddit-name' className='text-sm font-medium text-foreground'>
          서브레딧 이름
        </label>
        <div className='flex items-center rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition focus-within:border-accent focus-within:bg-surface'>
          <span className='mr-2 text-muted'>r/</span>
          <input
            id='subreddit-name'
            type='text'
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setFieldErrors((current) => ({ ...current, name: undefined }))
            }}
            className='w-full bg-transparent outline-none'
            placeholder='community_name'
            autoComplete='off'
          />
        </div>
        {fieldErrors.name ? <p className='text-sm text-danger'>{fieldErrors.name}</p> : null}
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='subreddit-description' className='text-sm font-medium text-foreground'>
          설명
        </label>
        <textarea
          id='subreddit-description'
          rows={6}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value)
            setFieldErrors((current) => ({ ...current, description: undefined }))
          }}
          className='rounded-[1.5rem] border border-border bg-background px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-accent focus:bg-surface'
          placeholder='이 커뮤니티에서 어떤 대화를 나누게 될지 짧게 설명해 주세요.'
        />
        {fieldErrors.description ? (
          <p className='text-sm text-danger'>{fieldErrors.description}</p>
        ) : (
          <p className='text-xs text-muted'>선택 사항이며 300자 이하로 입력할 수 있습니다.</p>
        )}
      </div>

      {submitError ? <p className='text-sm text-danger'>{submitError}</p> : null}

      <button
        type='submit'
        disabled={isSubmitting}
        className='rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? '생성 중...' : '서브레딧 만들기'}
      </button>
    </form>
  )
}
