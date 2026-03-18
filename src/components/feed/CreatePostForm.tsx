'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CreatePostFormProps = {
  subredditName: string
}

type CreatePostFieldErrors = {
  title?: string
  body?: string
  subredditName?: string
}

type CreatePostErrorResponse = {
  message?: string
  fieldErrors?: CreatePostFieldErrors
}

export function CreatePostForm({ subredditName }: CreatePostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [fieldErrors, setFieldErrors] = useState<CreatePostFieldErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        subredditName,
      }),
    })

    if (!response.ok) {
      const errorResponse = (await response.json().catch(() => null)) as CreatePostErrorResponse | null
      setFieldErrors(errorResponse?.fieldErrors ?? {})
      setSubmitError(errorResponse?.message ?? '게시글 작성 중 오류가 발생했습니다.')
      setIsSubmitting(false)
      return
    }

    const data = (await response.json()) as {
      post: {
        id: string
        subredditName: string
      }
    }

    setIsSubmitting(false)
    router.push(`/r/${data.post.subredditName}/${data.post.id}`)
    router.refresh()
  }

  return (
    <form className='mt-8 flex flex-col gap-5' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2'>
        <label htmlFor='post-title' className='text-sm font-medium text-foreground'>
          제목
        </label>
        <input
          id='post-title'
          type='text'
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            setFieldErrors((current) => ({ ...current, title: undefined }))
          }}
          placeholder='예: 피드 디자인에서 메타 정보 우선순위를 어떻게 정하고 계신가요?'
          className='rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:bg-surface'
        />
        {fieldErrors.title ? (
          <p className='text-sm text-danger'>{fieldErrors.title}</p>
        ) : (
          <p className='text-xs text-muted'>1자 이상 300자 이하로 입력합니다.</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='post-body' className='text-sm font-medium text-foreground'>
          본문
        </label>
        <textarea
          id='post-body'
          rows={10}
          value={body}
          onChange={(event) => {
            setBody(event.target.value)
            setFieldErrors((current) => ({ ...current, body: undefined }))
          }}
          placeholder='현재 상황, 시도한 것, 원하는 피드백을 순서대로 적어보세요.'
          className='rounded-[1.5rem] border border-border bg-background px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-accent focus:bg-surface'
        />
        {fieldErrors.body ? (
          <p className='text-sm text-danger'>{fieldErrors.body}</p>
        ) : (
          <p className='text-xs text-muted'>
            긴 설명보다 맥락과 질문이 먼저 보이도록 정리하는 편이 좋습니다.
          </p>
        )}
      </div>

      <div className='rounded-[1.7rem] border border-border bg-surface-strong px-5 py-5'>
        <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-accent'>
          Preview Tone
        </p>
        <div className='mt-4 rounded-[1.5rem] border border-border bg-surface px-4 py-4'>
          <p className='text-sm font-semibold text-deep'>r/{subredditName}</p>
          <h2 className='mt-3 text-2xl font-semibold tracking-tight text-deep'>
            {title || '피드에 올라갈 제목 미리보기'}
          </h2>
          <p className='mt-3 text-sm leading-7 text-muted'>
            {body || '실제 게시글 작성 후에는 이 카드 스타일이 피드와 상세 화면에 그대로 이어집니다.'}
          </p>
        </div>
      </div>

      {submitError ? <p className='text-sm text-danger'>{submitError}</p> : null}

      <div className='flex flex-wrap gap-3 pt-2'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isSubmitting ? '게시 중...' : '게시글 작성'}
        </button>
      </div>
    </form>
  )
}
