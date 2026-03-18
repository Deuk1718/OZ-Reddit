import type { Subreddit } from '@/domain/entities/Subreddit'
import type { SubredditRepository } from '@/application/repositories/SubredditRepository'

type GetSubredditsDependencies = {
  subredditRepository: SubredditRepository
}

export async function getSubreddits(
  dependencies: GetSubredditsDependencies
): Promise<Subreddit[]> {
  return dependencies.subredditRepository.getAll()
}
