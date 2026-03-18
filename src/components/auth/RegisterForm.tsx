'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
  normalizeNickname,
  normalizeUsername,
  validateEmail,
  validateInterests,
  validateNickname,
  validatePassword,
  validateUsername,
} from '@/domain/rules/authRules'
import {
  EMPTY_REGISTER_DRAFT,
  REGISTER_DRAFT_STORAGE_KEY,
} from '@/lib/auth/registerFlow'

type RegisterFieldErrors = {
  email?: string
  username?: string
  nickname?: string
  password?: string
  confirmPassword?: string
  interests?: string
}

type RegisterSuccessResponse = {
  user: {
    id: string
    email: string
    username: string
    nickname: string
    interests: string[]
  }
}

type RegisterErrorResponse = {
  message?: string
  fieldErrors?: RegisterFieldErrors
}

export function RegisterForm() {
  const router = useRouter()
  const [draft, setDraft] = useState(() => {
    if (typeof window === 'undefined') {
      return EMPTY_REGISTER_DRAFT
    }

    const savedDraft = window.sessionStorage.getItem(REGISTER_DRAFT_STORAGE_KEY)

    if (!savedDraft) {
      return EMPTY_REGISTER_DRAFT
    }

    return JSON.parse(savedDraft) as typeof EMPTY_REGISTER_DRAFT
  })
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateDraft(nextDraft: typeof EMPTY_REGISTER_DRAFT) {
    setDraft(nextDraft)
    window.sessionStorage.setItem(REGISTER_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    const nextFieldErrors: RegisterFieldErrors = {
      email: validateEmail(draft.email.trim()) ?? undefined,
      username: validateUsername(normalizeUsername(draft.username)) ?? undefined,
      nickname: validateNickname(normalizeNickname(draft.nickname)) ?? undefined,
      password: validatePassword(draft.password) ?? undefined,
      confirmPassword:
        draft.password === draft.confirmPassword ? undefined : '비밀번호 확인이 일치하지 않습니다.',
      interests: validateInterests(draft.interests) ?? undefined,
    }

    setFieldErrors(nextFieldErrors)

    if (
      nextFieldErrors.email ||
      nextFieldErrors.username ||
      nextFieldErrors.nickname ||
      nextFieldErrors.password ||
      nextFieldErrors.confirmPassword ||
      nextFieldErrors.interests
    ) {
      return
    }

    setIsSubmitting(true)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: draft.email,
        username: draft.username,
        nickname: draft.nickname,
        password: draft.password,
        interests: draft.interests,
      }),
    })

    if (!response.ok) {
      const errorResponse = (await response.json().catch(() => null)) as RegisterErrorResponse | null
      setFieldErrors(errorResponse?.fieldErrors ?? {})
      setSubmitError(errorResponse?.message ?? '회원가입 처리 중 오류가 발생했습니다.')
      setIsSubmitting(false)
      return
    }

    await response.json().catch(() => null as RegisterSuccessResponse | null)

    const signInResult = await signIn('credentials', {
      email: draft.email,
      password: draft.password,
      redirect: false,
      callbackUrl: '/',
    })

    setIsSubmitting(false)

    if (!signInResult || signInResult.error) {
      router.push('/login')
      router.refresh()
      return
    }

    window.sessionStorage.removeItem(REGISTER_DRAFT_STORAGE_KEY)
    router.push(signInResult.url ?? '/')
    router.refresh()
  }

  function handleInterestPageOpen() {
    router.push('/register/interests')
  }

  return (
    <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2'>
        <label htmlFor='username' className='text-sm font-medium text-foreground'>
          유저네임
        </label>
        <input
          id='username'
          type='text'
          value={draft.username}
          onChange={(event) => {
            const nextDraft = { ...draft, username: event.target.value }
            updateDraft(nextDraft)
            setFieldErrors((current) => ({ ...current, username: undefined }))
          }}
          className='rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:bg-surface'
          placeholder='reddit_user'
          autoComplete='username'
        />
        {fieldErrors.username ? (
          <p className='text-sm text-danger'>{fieldErrors.username}</p>
        ) : null}
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='nickname' className='text-sm font-medium text-foreground'>
          닉네임
        </label>
        <input
          id='nickname'
          type='text'
          value={draft.nickname}
          onChange={(event) => {
            const nextDraft = { ...draft, nickname: event.target.value }
            updateDraft(nextDraft)
            setFieldErrors((current) => ({ ...current, nickname: undefined }))
          }}
          className='rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:bg-surface'
          placeholder='커뮤니티에서 표시될 이름'
          autoComplete='nickname'
        />
        {fieldErrors.nickname ? (
          <p className='text-sm text-danger'>{fieldErrors.nickname}</p>
        ) : null}
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='email' className='text-sm font-medium text-foreground'>
          이메일
        </label>
        <input
          id='email'
          type='email'
          value={draft.email}
          onChange={(event) => {
            const nextDraft = { ...draft, email: event.target.value }
            updateDraft(nextDraft)
            setFieldErrors((current) => ({ ...current, email: undefined }))
          }}
          className='rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:bg-surface'
          placeholder='you@example.com'
          autoComplete='email'
        />
        {fieldErrors.email ? (
          <p className='text-sm text-danger'>{fieldErrors.email}</p>
        ) : null}
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='password' className='text-sm font-medium text-foreground'>
          비밀번호
        </label>
        <input
          id='password'
          type='password'
          value={draft.password}
          onChange={(event) => {
            const nextDraft = { ...draft, password: event.target.value }
            updateDraft(nextDraft)
            setFieldErrors((current) => ({ ...current, password: undefined }))
          }}
          className='rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:bg-surface'
          placeholder='8자 이상 입력하세요'
          autoComplete='new-password'
        />
        {fieldErrors.password ? (
          <p className='text-sm text-danger'>{fieldErrors.password}</p>
        ) : null}
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='confirmPassword' className='text-sm font-medium text-foreground'>
          비밀번호 확인
        </label>
        <input
          id='confirmPassword'
          type='password'
          value={draft.confirmPassword}
          onChange={(event) => {
            const nextDraft = { ...draft, confirmPassword: event.target.value }
            updateDraft(nextDraft)
            setFieldErrors((current) => ({ ...current, confirmPassword: undefined }))
          }}
          className='rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:bg-surface'
          placeholder='비밀번호를 한 번 더 입력하세요'
          autoComplete='new-password'
        />
        {fieldErrors.confirmPassword ? (
          <p className='text-sm text-danger'>{fieldErrors.confirmPassword}</p>
        ) : null}
      </div>

      <div className='rounded-3xl border border-border bg-surface-strong p-4'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm font-medium text-foreground'>관심사</p>
            <p className='mt-1 text-sm leading-6 text-muted'>
              관심 커뮤니티를 빠르게 추천할 수 있도록 관심사를 선택하세요.
            </p>
          </div>
          <button
            type='button'
            onClick={handleInterestPageOpen}
            className='rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white'
          >
            관심사 선택하기
          </button>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {draft.interests.length > 0 ? (
            draft.interests.map((interest) => (
              <span
                key={interest}
                className='rounded-full bg-highlight-soft px-3 py-1 text-sm font-medium text-deep'
              >
                {interest}
              </span>
            ))
          ) : (
            <span className='text-sm text-muted'>아직 선택한 관심사가 없습니다.</span>
          )}
        </div>

        {fieldErrors.interests ? (
          <p className='mt-3 text-sm text-danger'>{fieldErrors.interests}</p>
        ) : null}
      </div>

      {submitError ? <p className='text-sm text-danger'>{submitError}</p> : null}

      <button
        type='submit'
        disabled={isSubmitting}
        className='rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.22)] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? '가입 중...' : '회원가입'}
      </button>
    </form>
  )
}
