const SUBREDDIT_NAME_REGEX = /^[a-zA-Z0-9_]+$/

export const MIN_SUBREDDIT_NAME_LENGTH = 3
export const MAX_SUBREDDIT_NAME_LENGTH = 21
export const MAX_SUBREDDIT_DESCRIPTION_LENGTH = 300

export function validateSubredditName(name: string): string | null {
  if (
    name.length < MIN_SUBREDDIT_NAME_LENGTH ||
    name.length > MAX_SUBREDDIT_NAME_LENGTH
  ) {
    return `서브레딧 이름은 ${MIN_SUBREDDIT_NAME_LENGTH}자 이상 ${MAX_SUBREDDIT_NAME_LENGTH}자 이하여야 합니다.`
  }

  if (!SUBREDDIT_NAME_REGEX.test(name)) {
    return '서브레딧 이름은 영문, 숫자, 언더스코어만 사용할 수 있습니다.'
  }

  return null
}

export function validateSubredditDescription(description: string): string | null {
  if (description.length > MAX_SUBREDDIT_DESCRIPTION_LENGTH) {
    return `설명은 ${MAX_SUBREDDIT_DESCRIPTION_LENGTH}자 이하여야 합니다.`
  }

  return null
}

export function normalizeSubredditName(name: string): string {
  return name.trim().toLowerCase()
}

export function normalizeSubredditDescription(description: string): string {
  return description.trim()
}
