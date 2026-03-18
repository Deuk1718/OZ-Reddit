import {
  normalizeSubredditDescription,
  normalizeSubredditName,
  validateSubredditDescription,
  validateSubredditName,
} from '@/domain/rules/subredditRules'

import type { Subreddit } from '@/domain/entities/Subreddit'
import type { SubredditRepository } from '@/application/repositories/SubredditRepository'

import {
  SubredditAuthorizationError,
  SubredditConflictError,
  SubredditValidationError,
} from './subredditErrors'

export type CreateSubredditRequest = {
  name: string
  description: string
  creatorId: string | null
}

type CreateSubredditDependencies = {
  subredditRepository: SubredditRepository
}

export async function createSubreddit(
  input: CreateSubredditRequest,
  dependencies: CreateSubredditDependencies
): Promise<Subreddit> {
  if (!input.creatorId) {
    throw new SubredditAuthorizationError('서브레딧 생성은 로그인 후 이용할 수 있습니다.')
  }

  const name = normalizeSubredditName(input.name)
  const description = normalizeSubredditDescription(input.description)

  const fieldErrors = {
    name: validateSubredditName(name),
    description: validateSubredditDescription(description),
  }

  const filteredFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, value]) => value !== null)
  ) as Record<string, string>

  if (Object.keys(filteredFieldErrors).length > 0) {
    throw new SubredditValidationError(
      '서브레딧 정보를 다시 확인해 주세요.',
      filteredFieldErrors
    )
  }

  const existingSubreddit = await dependencies.subredditRepository.findByName(name)

  if (existingSubreddit) {
    throw new SubredditConflictError('이미 사용 중인 서브레딧 이름입니다.', 'name')
  }

  return dependencies.subredditRepository.create({
    name,
    description: description.length > 0 ? description : null,
    createdBy: input.creatorId,
  })
}
