export type Subreddit = {
  id: string
  name: string
  description: string | null
  createdBy: string | null
  creatorUsername: string | null
  memberCount: number
  postCount: number
  createdAt: Date
}
