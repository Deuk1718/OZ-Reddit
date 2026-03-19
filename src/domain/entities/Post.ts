import type { CurrentVoteValue } from '@/domain/entities/Vote'

export type Post = {
  id: string
  title: string
  body: string | null
  authorId: string | null
  authorUsername: string | null
  subredditId: string
  subredditName: string
  score: number
  currentUserVote: CurrentVoteValue
  commentCount: number
  createdAt: Date
  updatedAt: Date
}
