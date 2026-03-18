import type { Subreddit } from '@/domain/entities/Subreddit'

export type CreateSubredditInput = {
  name: string
  description: string | null
  createdBy: string
}

export interface SubredditRepository {
  findByName(name: string): Promise<Subreddit | null>
  getAll(): Promise<Subreddit[]>
  create(input: CreateSubredditInput): Promise<Subreddit>
}
