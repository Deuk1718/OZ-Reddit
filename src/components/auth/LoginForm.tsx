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
      setSubmitError('Failed to process login request.')
      return
    }

    if (result.error) {
      setFieldErrors({
        email: 'Please check your email or password.',
        password: 'Please check your email or password.',
      })
      return
    }

    router.push(result.url ?? '/')
    router.refresh()
  }

  return (
    <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-300 ml-1'>Magic Scroll (Email)</label>
        <div className='relative'>
          <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>mail</span>
          <input
            type='email'
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setFieldErrors((current) => ({ ...current, email: undefined }))
            }}
            className='w-full bg-background/50 border border-slate-700/50 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-600'
            placeholder='name@emeraldcity.com'
            autoComplete='email'
          />
        </div>
        {fieldErrors.email && <p className='text-xs text-danger ml-1'>{fieldErrors.email}</p>}
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-300 ml-1'>Secret Spell (Password)</label>
        <div className='relative'>
          <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'>lock</span>
          <input
            type='password'
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setFieldErrors((current) => ({ ...current, password: undefined }))
            }}
            className='w-full bg-background/50 border border-slate-700/50 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-600'
            placeholder='Enter your incantation'
            autoComplete='current-password'
          />
        </div>
        {fieldErrors.password && <p className='text-xs text-danger ml-1'>{fieldErrors.password}</p>}
      </div>

      {submitError && <p className='text-sm text-danger text-center'>{submitError}</p>}

      <button
        type='submit'
        disabled={isSubmitting}
        className='cta-gradient w-full py-4 rounded-lg text-white font-bold text-lg shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <span>{isSubmitting ? 'Casting Spell...' : 'Summon Profile'}</span>
        {!isSubmitting && <span className='material-symbols-outlined'>east</span>}
      </button>
    </form>
  )
}
