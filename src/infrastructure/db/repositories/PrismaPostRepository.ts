import { prisma } from '@/infrastructure/db/prisma'

import type {
  CreatePostInput,
  GetPostsOptions,
  PostRepository,
} from '@/application/repositories/PostRepository'
import type { CurrentVoteValue } from '@/domain/entities/Vote'
import type { Post } from '@/domain/entities/Post'

type PostRecord = {
  id: string
  title: string
  body: string | null
  authorId: string | null
  subredditId: string
  score: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
  author: {
    username: string
  } | null
  subreddit: {
    name: string
  }
}

const postInclude = {
  author: {
    select: {
      username: true,
    },
  },
  subreddit: {
    select: {
      name: true,
    },
  },
} as const

async function getPostVoteMap(
  postIds: string[],
  viewerUserId?: string
): Promise<Map<string, CurrentVoteValue>> {
  if (!viewerUserId || postIds.length === 0) {
    return new Map()
  }

  const votes = await prisma.vote.findMany({
    where: {
      userId: viewerUserId,
      targetType: 'post',
      targetId: {
        in: postIds,
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

function toDomainPost(
  post: PostRecord,
  currentUserVote: CurrentVoteValue = 0
): Post {
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    authorId: post.authorId,
    authorUsername: post.author?.username ?? null,
    subredditId: post.subredditId,
    subredditName: post.subreddit.name,
    score: post.score,
    currentUserVote,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}

export class PrismaPostRepository implements PostRepository {
  async create(input: CreatePostInput): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        title: input.title,
        body: input.body,
        author: {
          connect: {
            id: input.authorId,
          },
        },
        subreddit: {
          connect: {
            name: input.subredditName,
          },
        },
      },
      include: postInclude,
    })

    return toDomainPost(post)
  }

  async findById(id: string, viewerUserId?: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: postInclude,
    })

    if (!post) {
      return null
    }

    const voteMap = await getPostVoteMap([post.id], viewerUserId)

    return toDomainPost(post, voteMap.get(post.id) ?? 0)
  }

  async getAll(options?: GetPostsOptions): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: options?.subredditName
        ? {
            subreddit: {
              name: options.subredditName,
            },
          }
        : undefined,
      include: postInclude,
    })

    const voteMap = await getPostVoteMap(
      posts.map((post) => post.id),
      options?.viewerUserId
    )

    return posts.map((post) => toDomainPost(post, voteMap.get(post.id) ?? 0))
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    })
  }
}
