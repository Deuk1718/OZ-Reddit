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
        draft.password === draft.confirmPassword ? undefined : 'Password confirmation does not match.',
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
      setSubmitError(errorResponse?.message ?? 'An error occurred during registration.')
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
    <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-300 ml-1'>Traveler Name</label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>person</span>
            <input
              type='text'
              value={draft.username}
              onChange={(event) => {
                const nextDraft = { ...draft, username: event.target.value }
                updateDraft(nextDraft)
                setFieldErrors((current) => ({ ...current, username: undefined }))
              }}
              className='w-full bg-background/50 border border-slate-700/50 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-600'
              placeholder='e.g. Dorothy Gale'
              autoComplete='username'
            />
          </div>
          {fieldErrors.username && <p className='text-xs text-danger ml-1'>{fieldErrors.username}</p>}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-300 ml-1'>Nickname</label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>badge</span>
            <input
              type='text'
              value={draft.nickname}
              onChange={(event) => {
                const nextDraft = { ...draft, nickname: event.target.value }
                updateDraft(nextDraft)
                setFieldErrors((current) => ({ ...current, nickname: undefined }))
              }}
              className='w-full bg-background/50 border border-slate-700/50 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-600'
              placeholder='Display name'
              autoComplete='nickname'
            />
          </div>
          {fieldErrors.nickname && <p className='text-xs text-danger ml-1'>{fieldErrors.nickname}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-300 ml-1'>Magic Scroll (Email)</label>
        <div className='relative'>
          <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>mail</span>
          <input
            type='email'
            value={draft.email}
            onChange={(event) => {
              const nextDraft = { ...draft, email: event.target.value }
              updateDraft(nextDraft)
              setFieldErrors((current) => ({ ...current, email: undefined }))
            }}
            className='w-full bg-background/50 border border-slate-700/50 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-600'
            placeholder='name@emeraldcity.com'
            autoComplete='email'
          />
        </div>
        {fieldErrors.email && <p className='text-xs text-danger ml-1'>{fieldErrors.email}</p>}
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-300 ml-1'>Secret Spell (Password)</label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>lock</span>
            <input
              type='password'
              value={draft.password}
              onChange={(event) => {
                const nextDraft = { ...draft, password: event.target.value }
                updateDraft(nextDraft)
                setFieldErrors((current) => ({ ...current, password: undefined }))
              }}
              className='w-full bg-background/50 border border-slate-700/50 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-600'
              placeholder='Enter your incantation'
              autoComplete='new-password'
            />
          </div>
          {fieldErrors.password && <p className='text-xs text-danger ml-1'>{fieldErrors.password}</p>}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-300 ml-1'>Confirm Spell</label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>key</span>
            <input
              type='password'
              value={draft.confirmPassword}
              onChange={(event) => {
                const nextDraft = { ...draft, confirmPassword: event.target.value }
                updateDraft(nextDraft)
                setFieldErrors((current) => ({ ...current, confirmPassword: undefined }))
              }}
              className='w-full bg-background/50 border border-slate-700/50 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-600'
              placeholder='Confirm spell'
              autoComplete='new-password'
            />
          </div>
          {fieldErrors.confirmPassword && <p className='text-xs text-danger ml-1'>{fieldErrors.confirmPassword}</p>}
        </div>
      </div>

      {/* Interests Trigger */}
      <div className='bg-accent/5 border border-accent/10 rounded-xl p-5'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-bold text-slate-200'>Select your Interests</p>
            <p className='text-xs text-slate-500 mt-1'>Choose your magical paths in Oz.</p>
          </div>
          <button
            type='button'
            onClick={handleInterestPageOpen}
            className='px-4 py-2 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs font-bold hover:bg-accent hover:text-white transition-all'
          >
            {draft.interests.length > 0 ? 'Change Path' : 'Select Path'}
          </button>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {draft.interests.length > 0 ? (
            draft.interests.map((interest) => (
              <span
                key={interest}
                className='rounded-full bg-accent/20 border border-accent/20 px-3 py-1 text-xs font-medium text-accent'
              >
                {interest}
              </span>
            ))
          ) : (
            <span className='text-xs text-slate-500'>No paths selected yet.</span>
          )}
        </div>
        {fieldErrors.interests && <p className='mt-2 text-xs text-danger'>{fieldErrors.interests}</p>}
      </div>

      {submitError && <p className='text-sm text-danger text-center'>{submitError}</p>}

      <button
        type='submit'
        disabled={isSubmitting}
        className='cta-gradient w-full py-4 rounded-lg text-white font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <span>{isSubmitting ? 'Casting Spell...' : 'Begin Your Journey'}</span>
        {!isSubmitting && <span className='material-symbols-outlined'>east</span>}
      </button>
    </form>
  )
}
