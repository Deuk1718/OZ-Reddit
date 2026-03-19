import type { CurrentVoteValue, Vote, VoteTargetType, VoteValue } from '@/domain/entities/Vote'

export type CastVoteInput = {
  userId: string
  targetType: VoteTargetType
  targetId: string
  value: VoteValue
}

export type CastVoteResult = {
  vote: Vote
  score: number
}

export type RemoveVoteInput = {
  userId: string
  targetType: VoteTargetType
  targetId: string
}

export type RemoveVoteResult = {
  deleted: boolean
  score: number
  currentVote: CurrentVoteValue
}

export interface VoteRepository {
  cast(input: CastVoteInput): Promise<CastVoteResult>
  remove(input: RemoveVoteInput): Promise<RemoveVoteResult>
}
