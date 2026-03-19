import { Prisma } from '@/generated/prisma/client'

import { prisma } from '@/infrastructure/db/prisma'

import type {
  CommentRepository,
  CreateCommentInput,
} from '@/application/repositories/CommentRepository'
import type { Comment } from '@/domain/entities/Comment'
import type { CurrentVoteValue } from '@/domain/entities/Vote'

import { CommentAuthorizationError } from '@/application/use-cases/commentErrors'

type CommentRecord = {
  id: string
  body: string
  authorId: string | null
  postId: string
  parentId: string | null
  score: number
  createdAt: Date
  author: {
    username: string
  } | null
}

async function getCommentVoteMap(
  commentIds: string[],
  viewerUserId?: string
): Promise<Map<string, CurrentVoteValue>> {
  if (!viewerUserId || commentIds.length === 0) {
    return new Map()
  }

  const votes = await prisma.vote.findMany({
    where: {
      userId: viewerUserId,
      targetType: 'comment',
      targetId: {
        in: commentIds,
      },
    },
    select: {
      targetId: true,
      value: true,
    },
  })

  return new Map(
    votes.map((vote) => [vote.targetId, vote.value as CurrentVoteValue])
  )
}

function toDomainComment(
  comment: CommentRecord,
  currentUserVote: CurrentVoteValue = 0
): Comment {
  return {
    id: comment.id,
    body: comment.body,
    authorId: comment.authorId,
    authorUsername: comment.author?.username ?? null,
    postId: comment.postId,
    parentId: comment.parentId,
    score: comment.score,
    currentUserVote,
    createdAt: comment.createdAt,
    replies: [],
  }
}

const commentInclude = {
  author: {
    select: {
      username: true,
    },
  },
} as const

export class PrismaCommentRepository implements CommentRepository {
  async create(input: CreateCommentInput): Promise<Comment> {
    const comment = await prisma.$transaction(async (tx) => {
      const createdComment = await tx.comment.create({
        data: {
          body: input.body,
          author: {
            connect: {
              id: input.authorId,
            },
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
          ...(input.parentId
            ? {
                parent: {
                  connect: {
                    id: input.parentId,
                  },
                },
              }
            : {}),
        },
        include: commentInclude,
      })

      await tx.post.update({
        where: { id: input.postId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      })

      return createdComment
    }).catch((error: unknown) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new CommentAuthorizationError('유효하지 않은 사용자입니다. 다시 로그인해 주세요.')
      }
      throw error
    })

    return toDomainComment(comment)
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: commentInclude,
    })

    return comment ? toDomainComment(comment) : null
  }

  async getByPostId(postId: string, viewerUserId?: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: commentInclude,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const voteMap = await getCommentVoteMap(
      comments.map((comment) => comment.id),
      viewerUserId
    )
    const commentMap = new Map<string, Comment>(
      comments.map((commentRecord) => {
        const comment = toDomainComment(
          commentRecord,
          voteMap.get(commentRecord.id) ?? 0
        )
        return [comment.id, comment]
      })
    )
    const rootComments: Comment[] = []

    for (const comment of commentMap.values()) {
      if (!comment.parentId) {
        rootComments.push(comment)
        continue
      }

      const parent = commentMap.get(comment.parentId)

      if (parent) {
        parent.replies.push(comment)
      }
    }

    return rootComments
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: { id },
        select: {
          id: true,
          postId: true,
        },
      })

      if (!comment) {
        return
      }

      const replyCount = await tx.comment.count({
        where: {
          parentId: comment.id,
        },
      })

      await tx.comment.delete({
        where: { id },
      })

      await tx.post.update({
        where: { id: comment.postId },
        data: {
          commentCount: {
            decrement: replyCount + 1,
          },
        },
      })
    })
  }
}
