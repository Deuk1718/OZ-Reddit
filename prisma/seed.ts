import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

import { PrismaClient } from '../src/generated/prisma/client'

const SALT_ROUNDS = 10
const DEFAULT_PASSWORD = 'password123'

type SeedUser = {
  username: string
  nickname: string
  email: string
  interests: string[]
}

type SeedSubreddit = {
  name: string
  description: string
  creatorUsername: string
}

type CreatedRecordMap = Record<string, { id: string }>

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL 환경 변수가 설정되지 않았습니다')
  }

  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

async function resetDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.vote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.subreddit.deleteMany()
  await prisma.user.deleteMany()
}

async function seedUsers(prisma: PrismaClient): Promise<CreatedRecordMap> {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS)

  const users: SeedUser[] = [
    {
      username: 'wizard_oz',
      nickname: 'Wizard Oz',
      email: 'wizard@oz.com',
      interests: ['magic', 'leadership'],
    },
    {
      username: 'dorothy',
      nickname: 'Dorothy',
      email: 'dorothy@oz.com',
      interests: ['adventure', 'friendship'],
    },
    {
      username: 'scarecrow',
      nickname: 'Scarecrow',
      email: 'scarecrow@oz.com',
      interests: ['wisdom', 'fields'],
    },
  ]

  const userMap: CreatedRecordMap = {}

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        passwordHash,
        interests: user.interests,
      },
      select: {
        id: true,
      },
    })

    userMap[user.username] = createdUser
  }

  return userMap
}

async function seedSubreddits(
  prisma: PrismaClient,
  userMap: CreatedRecordMap,
): Promise<CreatedRecordMap> {
  const subreddits: SeedSubreddit[] = [
    {
      name: 'emeraldcity',
      description: '에메랄드 시티의 소식과 마법 이야기를 나누는 공간',
      creatorUsername: 'wizard_oz',
    },
    {
      name: 'munchkinland',
      description: '먼치킨랜드의 일상과 환영 인사를 모아두는 공간',
      creatorUsername: 'dorothy',
    },
    {
      name: 'wickedwest',
      description: '서쪽의 거친 분위기와 생존 팁을 공유하는 공간',
      creatorUsername: 'scarecrow',
    },
  ]

  const subredditMap: CreatedRecordMap = {}

  for (const subreddit of subreddits) {
    const createdSubreddit = await prisma.subreddit.create({
      data: {
        name: subreddit.name,
        description: subreddit.description,
        createdBy: userMap[subreddit.creatorUsername].id,
        memberCount: 3,
      },
      select: {
        id: true,
      },
    })

    subredditMap[subreddit.name] = createdSubreddit
  }

  return subredditMap
}

async function seedPosts(
  prisma: PrismaClient,
  userMap: CreatedRecordMap,
  subredditMap: CreatedRecordMap,
): Promise<string[]> {
  const authorUsernames = ['wizard_oz', 'dorothy', 'scarecrow']
  const postIds: string[] = []

  const subredditPosts: Record<string, string[]> = {
    emeraldcity: [
      '에메랄드 궁전 투어 후기',
      '대마법사의 공개 연설 정리',
      '초록빛 거리에서 꼭 가볼 곳',
    ],
    munchkinland: [
      '먼치킨 환영 축제 사진 모음',
      '도로시를 맞이한 첫날 이야기',
      '노란 벽돌길 근처 맛집 추천',
    ],
    wickedwest: [
      '서쪽 벌판에서 살아남는 법',
      '강풍 주의보와 이동 경로 공유',
      '빗자루 없이 이동하는 팁',
    ],
  }

  for (const [subredditName, titles] of Object.entries(subredditPosts)) {
    const subredditId = subredditMap[subredditName].id

    for (const [index, title] of titles.entries()) {
      const authorUsername = authorUsernames[index % authorUsernames.length]
      const createdPost = await prisma.post.create({
        data: {
          title,
          body: `${title}에 대한 시드 데이터 본문입니다. 오즈 세계관 기반 더미 콘텐츠입니다.`,
          authorId: userMap[authorUsername].id,
          subredditId,
          commentCount: 0,
          score: 0,
        },
        select: {
          id: true,
        },
      })

      postIds.push(createdPost.id)
    }
  }

  return postIds
}

async function seedComments(
  prisma: PrismaClient,
  userMap: CreatedRecordMap,
  postIds: string[],
): Promise<string[]> {
  const authorUsernames = ['dorothy', 'scarecrow', 'wizard_oz']
  const commentIds: string[] = []

  for (const [postIndex, postId] of postIds.entries()) {
    const firstComment = await prisma.comment.create({
      data: {
        body: `게시글 ${postIndex + 1}에 대한 첫 번째 의견입니다.`,
        authorId: userMap[authorUsernames[postIndex % authorUsernames.length]].id,
        postId,
        score: 0,
      },
      select: {
        id: true,
      },
    })

    const secondComment = await prisma.comment.create({
      data: {
        body: `게시글 ${postIndex + 1}에 대한 두 번째 의견입니다.`,
        authorId: userMap[authorUsernames[(postIndex + 1) % authorUsernames.length]].id,
        postId,
        score: 0,
      },
      select: {
        id: true,
      },
    })

    const replyComment = await prisma.comment.create({
      data: {
        body: `첫 번째 댓글에 대한 대댓글입니다.`,
        authorId: userMap[authorUsernames[(postIndex + 2) % authorUsernames.length]].id,
        postId,
        parentId: firstComment.id,
        score: 0,
      },
      select: {
        id: true,
      },
    })

    commentIds.push(firstComment.id, secondComment.id, replyComment.id)

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        commentCount: 3,
      },
    })
  }

  return commentIds
}

async function seedPostVotes(
  prisma: PrismaClient,
  userIds: string[],
  postIds: string[],
): Promise<void> {
  for (const [index, postId] of postIds.entries()) {
    const postVoteValues = [
      { userId: userIds[index % userIds.length], value: 1 },
      { userId: userIds[(index + 1) % userIds.length], value: 1 },
      { userId: userIds[(index + 2) % userIds.length], value: index % 2 === 0 ? -1 : 1 },
    ]

    for (const vote of postVoteValues) {
      await prisma.vote.create({
        data: {
          userId: vote.userId,
          targetType: 'post',
          targetId: postId,
          value: vote.value,
        },
      })
    }

    const score = postVoteValues.reduce((total, vote) => total + vote.value, 0)

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        score,
      },
    })
  }
}

async function seedCommentVotes(
  prisma: PrismaClient,
  userIds: string[],
  commentIds: string[],
): Promise<void> {
  for (const [index, commentId] of commentIds.entries()) {
    const commentVoteValues = index % 3 === 0
      ? [
          { userId: userIds[0], value: 1 },
          { userId: userIds[1], value: 1 },
        ]
      : index % 3 === 1
        ? [
            { userId: userIds[1], value: 1 },
            { userId: userIds[2], value: -1 },
          ]
        : [
            { userId: userIds[0], value: 1 },
            { userId: userIds[2], value: 1 },
          ]

    for (const vote of commentVoteValues) {
      await prisma.vote.create({
        data: {
          userId: vote.userId,
          targetType: 'comment',
          targetId: commentId,
          value: vote.value,
        },
      })
    }

    const score = commentVoteValues.reduce((total, vote) => total + vote.value, 0)

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        score,
      },
    })
  }
}

async function main(): Promise<void> {
  const prisma = createPrismaClient()

  try {
    await resetDatabase(prisma)

    const userMap = await seedUsers(prisma)
    const subredditMap = await seedSubreddits(prisma, userMap)
    const postIds = await seedPosts(prisma, userMap, subredditMap)
    const commentIds = await seedComments(prisma, userMap, postIds)
    const userIds = Object.values(userMap).map((user) => user.id)

    await seedPostVotes(prisma, userIds, postIds)
    await seedCommentVotes(prisma, userIds, commentIds)

    console.log(
      `시드 완료: users=${userIds.length}, subreddits=${Object.keys(subredditMap).length}, posts=${postIds.length}, comments=${commentIds.length}`,
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error: unknown) => {
  console.error('시드 실행 중 오류가 발생했습니다', error)
  process.exitCode = 1
})
