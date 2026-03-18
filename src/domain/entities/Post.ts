export type Post = {
  id: string
  title: string
  body: string | null
  authorId: string | null
  authorUsername: string | null
  subredditId: string
  subredditName: string
  score: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
}
