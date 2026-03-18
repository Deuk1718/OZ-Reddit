import type { Comment } from '@/domain/entities/Comment'

export type CreateCommentInput = {
  body: string
  authorId: string
  postId: string
  parentId: string | null
}

export interface CommentRepository {
  create(input: CreateCommentInput): Promise<Comment>
  findById(id: string): Promise<Comment | null>
  getByPostId(postId: string): Promise<Comment[]>
  delete(id: string): Promise<void>
}
