import type { Post } from '@/domain/entities/Post'

export type CreatePostInput = {
  title: string
  body: string | null
  authorId: string
  subredditName: string
}

export interface PostRepository {
  create(input: CreatePostInput): Promise<Post>
  findById(id: string): Promise<Post | null>
  getAll(subredditName?: string): Promise<Post[]>
  delete(id: string): Promise<void>
}
