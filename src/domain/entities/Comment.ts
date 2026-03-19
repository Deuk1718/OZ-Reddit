import type { CurrentVoteValue } from '@/domain/entities/Vote'

export type Comment = {
  id: string
  body: string
  authorId: string | null
  authorUsername: string | null
  postId: string
  parentId: string | null
  score: number
  currentUserVote: CurrentVoteValue
  createdAt: Date
  replies: Comment[]
}
