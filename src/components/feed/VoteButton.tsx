'use client'

import { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import type { CurrentVoteValue, VoteTargetType, VoteValue } from '@/domain/entities/Vote'

type VoteButtonProps = {
  targetType: VoteTargetType
  targetId: string
  initialScore: number
  initialVote: CurrentVoteValue
}

type VoteState = {
  score: number
  currentVote: CurrentVoteValue
}

type VoteResponse = {
  score: number
  currentVote: CurrentVoteValue
}

function formatScore(score: number): string {
  if (Math.abs(score) >= 1000) {
    return `${(score / 1000).toFixed(1)}k`
  }

  return String(score)
}

export function VoteButton({
  targetType,
  targetId,
  initialScore,
  initialVote,
}: VoteButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [voteState, setVoteState] = useState<VoteState>({
    score: initialScore,
    currentVote: initialVote,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitVote(nextVote: CurrentVoteValue): Promise<VoteResponse> {
    if (nextVote === 0) {
      const response = await fetch(`/api/votes/${targetType}/${targetId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('투표 취소에 실패했습니다.')
      }

      const data = (await response.json()) as VoteResponse
      return data
    }

    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        targetType,
        targetId,
        value: nextVote,
      }),
    })

    if (!response.ok) {
      throw new Error('투표 요청에 실패했습니다.')
    }

    const data = (await response.json()) as VoteResponse
    return data
  }

  function handleVote(nextDirection: VoteValue) {
    if (!session?.user?.id) {
      router.push('/login')
      return
    }

    if (isSubmitting) {
      return
    }

    const previousState = voteState
    const nextVote = previousState.currentVote === nextDirection ? 0 : nextDirection
    const optimisticState = {
      score: previousState.score - previousState.currentVote + nextVote,
      currentVote: nextVote,
    } satisfies VoteState

    setVoteState(optimisticState)
    setIsSubmitting(true)

    startTransition(async () => {
      try {
        const result = await submitVote(nextVote)
        setVoteState({
          score: result.score,
          currentVote: result.currentVote,
        })
      } catch {
        setVoteState(previousState)
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  const upvoteActive = voteState.currentVote === 1
  const downvoteActive = voteState.currentVote === -1

  return (
    <div className='inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2 py-1'>
      <button
        type='button'
        aria-label='업보트'
        className={`flex size-8 items-center justify-center rounded-full transition ${
          upvoteActive
            ? 'bg-accent text-white'
            : 'text-slate-400 hover:bg-accent/20 hover:text-accent'
        }`}
        onClick={() => handleVote(1)}
      >
        <span className='material-symbols-outlined text-base'>expand_less</span>
      </button>
      <span className='min-w-10 text-center text-xs font-bold text-accent'>
        {formatScore(voteState.score)}
      </span>
      <button
        type='button'
        aria-label='다운보트'
        className={`flex size-8 items-center justify-center rounded-full transition ${
          downvoteActive
            ? 'bg-red-500 text-white'
            : 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
        }`}
        onClick={() => handleVote(-1)}
      >
        <span className='material-symbols-outlined text-base'>expand_more</span>
      </button>
    </div>
  )
}
