'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { validateEmail, validatePassword } from '@/domain/rules/authRules'

type LoginFieldErrors = {
  email?: string
  password?: string
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    const nextFieldErrors: LoginFieldErrors = {
      email: validateEmail(email.trim()) ?? undefined,
      password: validatePassword(password) ?? undefined,
    }

    setFieldErrors(nextFieldErrors)

    if (nextFieldErrors.email || nextFieldErrors.password) {
      return
    }

    setIsSubmitting(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/',
    })

    setIsSubmitting(false)

    if (!result) {
      setSubmitError('로그인 요청을 처리하지 못했습니다.')
      return
    }

    if (result.error) {
      setFieldErrors({
        email: '이메일 또는 비밀번호를 확인해 주세요.',
        password: '이메일 또는 비밀번호를 확인해 주세요.',
      })
      return
    }

    router.push(result.url ?? '/')
    router.refresh()
  }

  return (
    <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2'>
        <label htmlFor='email' className='text-sm font-medium text-foreground'>
          이메일
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
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
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setFieldErrors((current) => ({ ...current, password: undefined }))
          }}
          className='rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:bg-surface'
          placeholder='비밀번호를 입력하세요'
          autoComplete='current-password'
        />
        {fieldErrors.password ? (
          <p className='text-sm text-danger'>{fieldErrors.password}</p>
        ) : null}
      </div>

      {submitError ? <p className='text-sm text-danger'>{submitError}</p> : null}

      <button
        type='submit'
        disabled={isSubmitting}
        className='rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.22)] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
