import { prisma } from '@/infrastructure/db/prisma'

import type {
  CommentRepository,
  CreateCommentInput,
} from '@/application/repositories/CommentRepository'
import type { Comment } from '@/domain/entities/Comment'

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

function toDomainComment(comment: CommentRecord): Comment {
  return {
    id: comment.id,
    body: comment.body,
    authorId: comment.authorId,
    authorUsername: comment.author?.username ?? null,
    postId: comment.postId,
    parentId: comment.parentId,
    score: comment.score,
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

  async getByPostId(postId: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: commentInclude,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const commentMap = new Map<string, Comment>(
      comments.map((commentRecord) => {
        const comment = toDomainComment(commentRecord)
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
