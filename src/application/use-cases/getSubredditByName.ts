import { normalizeSubredditName } from '@/domain/rules/subredditRules'

import type { Subreddit } from '@/domain/entities/Subreddit'
import type { SubredditRepository } from '@/application/repositories/SubredditRepository'

import { SubredditNotFoundError } from './subredditErrors'

type GetSubredditByNameDependencies = {
  subredditRepository: SubredditRepository
}

export async function getSubredditByName(
  name: string,
  dependencies: GetSubredditByNameDependencies
): Promise<Subreddit> {
  const subreddit = await dependencies.subredditRepository.findByName(
    normalizeSubredditName(name)
  )

  if (!subreddit) {
    throw new SubredditNotFoundError('서브레딧을 찾을 수 없습니다.')
  }

  return subreddit
}
