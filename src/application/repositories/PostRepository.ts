import type { Post } from '@/domain/entities/Post'

export type CreatePostInput = {
  title: string
  body: string | null
  authorId: string
  subredditName: string
}

export type GetPostsOptions = {
  subredditName?: string
  viewerUserId?: string
}

export interface PostRepository {
  create(input: CreatePostInput): Promise<Post>
  findById(id: string, viewerUserId?: string): Promise<Post | null>
  getAll(options?: GetPostsOptions): Promise<Post[]>
  delete(id: string): Promise<void>
}
