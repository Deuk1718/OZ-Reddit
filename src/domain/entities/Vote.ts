export type VoteTargetType = 'post' | 'comment'

export type VoteValue = -1 | 1

export type CurrentVoteValue = -1 | 0 | 1

export type Vote = {
  id: string
  userId: string
  targetType: VoteTargetType
  targetId: string
  value: VoteValue
  createdAt: Date
}
