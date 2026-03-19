'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { MAX_INTERESTS_COUNT } from '@/domain/rules/authRules'
import {
  EMPTY_REGISTER_DRAFT,
  INTEREST_OPTIONS,
  REGISTER_DRAFT_STORAGE_KEY,
} from '@/lib/auth/registerFlow'

const interestIcons: Record<string, string> = {
  '게임': 'sports_esports',
  '기술': 'devices',
  '영화': 'movie',
  '음악': 'music_note',
  '스포츠': 'sports_soccer',
  '패션': 'apparel',
  '음식': 'restaurant',
  '여행': 'explore',
  '독서': 'menu_book',
  '사진': 'photo_camera',
  '반려동물': 'pets',
  '과학': 'science',
}

export function InterestPicker() {
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const savedDraft = window.sessionStorage.getItem(REGISTER_DRAFT_STORAGE_KEY)

    if (!savedDraft) {
      return []
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
    <div className='flex flex-col items-center gap-8'>
      {/* Header Section */}
      <div className='text-center space-y-2 mb-4'>
        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4'>
          <span className='material-symbols-outlined text-accent text-sm'>auto_awesome</span>
          <span className='text-accent text-xs font-bold uppercase tracking-widest'>Portal Selection</span>
        </div>
        <h1 className='text-5xl md:text-6xl font-bold tracking-tight text-white glow-text'>Choose Interests</h1>
        <p className='text-slate-400 text-lg max-w-lg mx-auto'>
          Select your paths through the magical Land of Oz.
        </p>
      </div>

      {/* Sign-up Card */}
      <div className='glass-card w-full max-w-2xl rounded-xl p-8 md:p-12 shadow-2xl'>
        <div className='space-y-8'>
          <div className='space-y-4'>
            <div className='flex justify-between items-center px-1'>
              <p className='text-sm font-medium text-slate-300'>Select up to {MAX_INTERESTS_COUNT} interests</p>
              <p className='text-xs text-slate-500 font-bold uppercase tracking-widest'>
                {selectedInterests.length} / {MAX_INTERESTS_COUNT} Selected
              </p>
            </div>
            
            <div className='flex flex-wrap gap-3'>
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest)
                const icon = interestIcons[interest] || 'explore'

                return (
                  <button
                    key={interest}
                    type='button'
                    onClick={() => toggleInterest(interest)}
                    className={`px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 text-sm font-medium ${
                      isSelected
                        ? 'border-accent/40 bg-accent/20 text-white ring-1 ring-accent/50 shadow-[0_0_15px_rgba(159,31,239,0.3)]'
                        : 'border-slate-700 bg-background/50 text-slate-300 hover:border-accent/40 hover:text-white'
                    }`}
                  >
                    <span className='material-symbols-outlined text-sm'>{icon}</span>
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className='pt-4'>
            <button
              onClick={handleComplete}
              disabled={selectedInterests.length === 0}
              className='cta-gradient w-full py-5 rounded-lg text-white font-bold text-xl shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              <span>Begin Your Journey</span>
              <span className='material-symbols-outlined'>east</span>
            </button>
            <p className='text-center text-slate-500 text-sm mt-6'>
              Prefer to choose later? <button onClick={() => router.push('/register')} className='text-accent hover:underline font-medium'>Return to Gateway</button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Meta */}
      <div className='flex items-center gap-8 text-slate-500 text-xs font-medium uppercase tracking-[0.2em]'>
        <div className='flex items-center gap-2'>
          <span className='material-symbols-outlined text-base'>verified_user</span>
          Secure Portal
        </div>
        <div className='flex items-center gap-2'>
          <span className='material-symbols-outlined text-base'>public</span>
          Global Oz Access
        </div>
      </div>
    </div>
  )
}
