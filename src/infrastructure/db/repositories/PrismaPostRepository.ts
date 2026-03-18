import { prisma } from '@/infrastructure/db/prisma'

import type { CreatePostInput, PostRepository } from '@/application/repositories/PostRepository'
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

function toDomainPost(post: PostRecord): Post {
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    authorId: post.authorId,
    authorUsername: post.author?.username ?? null,
    subredditId: post.subredditId,
    subredditName: post.subreddit.name,
    score: post.score,
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

  async findById(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: postInclude,
    })

    return post ? toDomainPost(post) : null
  }

  async getAll(subredditName?: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: subredditName
        ? {
            subreddit: {
              name: subredditName,
            },
          }
        : undefined,
      include: postInclude,
    })

    return posts.map(toDomainPost)
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    })
  }
}
