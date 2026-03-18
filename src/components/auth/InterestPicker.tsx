'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { MAX_INTERESTS_COUNT } from '@/domain/rules/authRules'
import {
  EMPTY_REGISTER_DRAFT,
  INTEREST_OPTIONS,
  REGISTER_DRAFT_STORAGE_KEY,
} from '@/lib/auth/registerFlow'

export function InterestPicker() {
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState(() => {
    if (typeof window === 'undefined') {
      return [] as string[]
    }

    const savedDraft = window.sessionStorage.getItem(REGISTER_DRAFT_STORAGE_KEY)

    if (!savedDraft) {
      return [] as string[]
    }

    const parsedDraft = JSON.parse(savedDraft) as typeof EMPTY_REGISTER_DRAFT
    return parsedDraft.interests
  })

  function toggleInterest(interest: string) {
    setSelectedInterests((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest)
      }

      if (current.length >= MAX_INTERESTS_COUNT) {
        return current
      }

      return [...current, interest]
    })
  }

  function handleComplete() {
    const savedDraft = window.sessionStorage.getItem(REGISTER_DRAFT_STORAGE_KEY)
    const parsedDraft = savedDraft
      ? ((JSON.parse(savedDraft) as typeof EMPTY_REGISTER_DRAFT) ?? EMPTY_REGISTER_DRAFT)
      : EMPTY_REGISTER_DRAFT

    window.sessionStorage.setItem(
      REGISTER_DRAFT_STORAGE_KEY,
      JSON.stringify({
        ...parsedDraft,
        interests: selectedInterests,
      })
    )

    router.push('/register')
  }

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-8'>
      <div className='rounded-[2rem] border border-border bg-surface p-8 shadow-[0_22px_80px_rgba(78,52,115,0.16)]'>
        <p className='text-sm font-medium uppercase tracking-[0.25em] text-muted'>
          회원가입 확장 정보
        </p>
        <h1 className='mt-3 text-4xl font-semibold tracking-tight text-foreground'>
          관심사를 선택해 주세요
        </h1>
        <p className='mt-3 max-w-2xl text-sm leading-7 text-muted'>
          최대 {MAX_INTERESTS_COUNT}개까지 선택할 수 있습니다. 나중에 프로필 설정에서
          변경할 수 있도록 설계할 예정입니다.
        </p>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {INTEREST_OPTIONS.map((interest) => {
          const isSelected = selectedInterests.includes(interest)

          return (
            <button
              key={interest}
              type='button'
              onClick={() => toggleInterest(interest)}
              className={`rounded-3xl border px-5 py-4 text-left text-sm font-semibold transition ${
                isSelected
                  ? 'border-accent bg-accent text-white shadow-[0_12px_36px_rgba(142,67,217,0.26)]'
                  : 'border-border bg-surface text-foreground hover:border-secondary hover:bg-background'
              }`}
            >
              {interest}
            </button>
          )
        })}
      </div>

      <div className='flex items-center justify-between gap-4 rounded-3xl border border-border bg-surface p-5'>
        <p className='text-sm text-muted'>
          선택됨: <span className='font-semibold text-foreground'>{selectedInterests.length}</span> /{' '}
          {MAX_INTERESTS_COUNT}
        </p>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => router.push('/register')}
            className='rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-background'
          >
            돌아가기
          </button>
          <button
            type='button'
            onClick={handleComplete}
            className='rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90'
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  )
}
