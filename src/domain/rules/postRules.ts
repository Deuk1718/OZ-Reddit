export const MIN_POST_TITLE_LENGTH = 1
export const MAX_POST_TITLE_LENGTH = 300
export const MAX_POST_BODY_LENGTH = 10000
const POST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validatePostTitle(title: string): string | null {
  if (title.length < MIN_POST_TITLE_LENGTH || title.length > MAX_POST_TITLE_LENGTH) {
    return `제목은 ${MIN_POST_TITLE_LENGTH}자 이상 ${MAX_POST_TITLE_LENGTH}자 이하여야 합니다.`
  }

  return null
}

export function validatePostBody(body: string): string | null {
  if (body.length > MAX_POST_BODY_LENGTH) {
    return `본문은 ${MAX_POST_BODY_LENGTH}자 이하여야 합니다.`
  }

  return null
}

export function normalizePostTitle(title: string): string {
  return title.trim()
}

export function normalizePostBody(body: string): string {
  return body.trim()
}

export function isValidPostId(id: string): boolean {
  return POST_ID_PATTERN.test(id)
}
