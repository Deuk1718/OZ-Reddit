import { prisma } from '@/infrastructure/db/prisma'

import type {
  CreateSubredditInput,
  SubredditRepository,
} from '@/application/repositories/SubredditRepository'
import type { Subreddit } from '@/domain/entities/Subreddit'

type SubredditRecord = {
  id: string
  name: string
  description: string | null
  createdBy: string | null
  memberCount: number
  createdAt: Date
  creator: {
    username: string
  } | null
  _count: {
    posts: number
  }
}

function toDomainSubreddit(subreddit: SubredditRecord): Subreddit {
  return {
    id: subreddit.id,
    name: subreddit.name,
    description: subreddit.description,
    createdBy: subreddit.createdBy,
    creatorUsername: subreddit.creator?.username ?? null,
    memberCount: subreddit.memberCount,
    postCount: subreddit._count.posts,
    createdAt: subreddit.createdAt,
  }
}

const subredditInclude = {
  creator: {
    select: {
      username: true,
    },
  },
  _count: {
    select: {
      posts: true,
    },
  },
} as const

export class PrismaSubredditRepository implements SubredditRepository {
  async findByName(name: string): Promise<Subreddit | null> {
    const subreddit = await prisma.subreddit.findUnique({
      where: { name },
      include: subredditInclude,
    })

    return subreddit ? toDomainSubreddit(subreddit) : null
  }

  async getAll(): Promise<Subreddit[]> {
    const subreddits = await prisma.subreddit.findMany({
      include: subredditInclude,
      orderBy: [
        { memberCount: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return subreddits.map(toDomainSubreddit)
  }

  async create(input: CreateSubredditInput): Promise<Subreddit> {
    const subreddit = await prisma.subreddit.create({
      data: input,
      include: subredditInclude,
    })

    return toDomainSubreddit(subreddit)
  }
}
