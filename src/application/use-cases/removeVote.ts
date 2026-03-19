import type { VoteRepository } from '@/application/repositories/VoteRepository'
import type { CurrentVoteValue, VoteTargetType } from '@/domain/entities/Vote'

import {
  isValidVoteTargetId,
  isVoteTargetType,
} from '@/domain/rules/voteRules'

import {
  VoteAuthorizationError,
  VoteValidationError,
} from '@/application/use-cases/voteErrors'

export type RemoveVoteInput = {
  userId: string | null
  targetType: VoteTargetType | string
  targetId: string
}

export type RemoveVoteResult = {
  deleted: boolean
  score: number
  currentVote: CurrentVoteValue
}

type RemoveVoteDependencies = {
  voteRepository: VoteRepository
}

export async function removeVote(
  input: RemoveVoteInput,
  dependencies: RemoveVoteDependencies
): Promise<RemoveVoteResult> {
  if (!input.userId) {
    throw new VoteAuthorizationError('로그인이 필요합니다.')
  }

  const fieldErrors: Record<string, string> = {}

  if (!isVoteTargetType(input.targetType)) {
    fieldErrors.targetType = '투표 대상 타입이 올바르지 않습니다.'
  }

  if (
    isVoteTargetType(input.targetType) &&
    !isValidVoteTargetId(input.targetType, input.targetId)
  ) {
    fieldErrors.targetId = '투표 대상 식별자가 올바르지 않습니다.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new VoteValidationError('투표 취소 요청이 올바르지 않습니다.', fieldErrors)
  }

  const targetType = input.targetType as VoteTargetType

  return dependencies.voteRepository.remove({
    userId: input.userId,
    targetType,
    targetId: input.targetId,
  })
}
