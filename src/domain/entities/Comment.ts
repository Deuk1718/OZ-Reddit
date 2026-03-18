export type Comment = {
  id: string
  body: string
  authorId: string | null
  authorUsername: string | null
  postId: string
  parentId: string | null
  score: number
  createdAt: Date
  replies: Comment[]
}
