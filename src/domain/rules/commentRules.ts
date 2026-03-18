export const MIN_COMMENT_BODY_LENGTH = 1
export const MAX_COMMENT_BODY_LENGTH = 2000
export const MAX_COMMENT_REPLY_DEPTH = 1

const COMMENT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validateCommentBody(body: string): string | null {
  if (body.length < MIN_COMMENT_BODY_LENGTH || body.length > MAX_COMMENT_BODY_LENGTH) {
    return `댓글은 ${MIN_COMMENT_BODY_LENGTH}자 이상 ${MAX_COMMENT_BODY_LENGTH}자 이하여야 합니다.`
  }

  return null
}

export function normalizeCommentBody(body: string): string {
  return body.trim()
}

export function isValidCommentId(id: string): boolean {
  return COMMENT_ID_PATTERN.test(id)
}
