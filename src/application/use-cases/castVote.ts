import type { VoteRepository } from '@/application/repositories/VoteRepository'
import type { Vote, VoteTargetType, VoteValue } from '@/domain/entities/Vote'

import {
  isValidVoteTargetId,
  isVoteTargetType,
  isVoteValue,
} from '@/domain/rules/voteRules'

import {
  VoteAuthorizationError,
  VoteValidationError,
} from '@/application/use-cases/voteErrors'

export type CastVoteInput = {
  userId: string | null
  targetType: VoteTargetType | string
  targetId: string
  value: VoteValue | number
}

export type CastVoteResult = {
  vote: Vote
  score: number
}

type CastVoteDependencies = {
  voteRepository: VoteRepository
}

export async function castVote(
  input: CastVoteInput,
  dependencies: CastVoteDependencies
): Promise<CastVoteResult> {
  if (!input.userId) {
    throw new VoteAuthorizationError('로그인이 필요합니다.')
  }

  const fieldErrors: Record<string, string> = {}

  if (!isVoteTargetType(input.targetType)) {
    fieldErrors.targetType = '투표 대상 타입이 올바르지 않습니다.'
  }

  if (!isVoteValue(input.value)) {
    fieldErrors.value = '투표 값은 1 또는 -1이어야 합니다.'
  }

  if (
    isVoteTargetType(input.targetType) &&
    !isValidVoteTargetId(input.targetType, input.targetId)
  ) {
    fieldErrors.targetId = '투표 대상 식별자가 올바르지 않습니다.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new VoteValidationError('투표 요청이 올바르지 않습니다.', fieldErrors)
  }

  const targetType = input.targetType as VoteTargetType
  const value = input.value as VoteValue

  return dependencies.voteRepository.cast({
    userId: input.userId,
    targetType,
    targetId: input.targetId,
    value,
  })
}
