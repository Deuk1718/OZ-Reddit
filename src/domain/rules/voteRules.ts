import { isValidCommentId } from '@/domain/rules/commentRules'
import { isValidPostId } from '@/domain/rules/postRules'

import type { VoteTargetType } from '@/domain/entities/Vote'

export function isVoteTargetType(value: string): value is VoteTargetType {
  return value === 'post' || value === 'comment'
}

export function isVoteValue(value: number): value is -1 | 1 {
  return value === -1 || value === 1
}

export function isValidVoteTargetId(
  targetType: VoteTargetType,
  targetId: string
): boolean {
  return targetType === 'post'
    ? isValidPostId(targetId)
    : isValidCommentId(targetId)
}
