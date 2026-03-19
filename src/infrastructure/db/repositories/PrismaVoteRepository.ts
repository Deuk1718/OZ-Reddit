import { prisma } from '@/infrastructure/db/prisma'

import type {
  CastVoteInput,
  CastVoteResult,
  RemoveVoteInput,
  RemoveVoteResult,
  VoteRepository,
} from '@/application/repositories/VoteRepository'
import type { VoteTargetType } from '@/domain/entities/Vote'

import { VoteNotFoundError } from '@/application/use-cases/voteErrors'

type VoteRecord = {
  id: string
  userId: string
  targetType: string
  targetId: string
  value: number
  createdAt: Date
}

type VoteTransaction = Pick<typeof prisma, 'comment' | 'post' | 'vote'>

function toTargetUpdateData(scoreDelta: number) {
  return {
    score: {
      increment: scoreDelta,
    },
  }
}

async function assertTargetExists(
  targetType: VoteTargetType,
  targetId: string
): Promise<number> {
  if (targetType === 'post') {
    const post = await prisma.post.findUnique({
      where: { id: targetId },
      select: { score: true },
    })

    if (!post) {
      throw new VoteNotFoundError('투표 대상을 찾을 수 없습니다.')
    }

    return post.score
  }

  const comment = await prisma.comment.findUnique({
    where: { id: targetId },
    select: { score: true },
  })

  if (!comment) {
    throw new VoteNotFoundError('투표 대상을 찾을 수 없습니다.')
  }

  return comment.score
}

function toDomainVote(vote: VoteRecord) {
  return {
    id: vote.id,
    userId: vote.userId,
    targetType: vote.targetType as VoteTargetType,
    targetId: vote.targetId,
    value: vote.value as -1 | 1,
    createdAt: vote.createdAt,
  }
}

export class PrismaVoteRepository implements VoteRepository {
  async cast(input: CastVoteInput): Promise<CastVoteResult> {
    await assertTargetExists(input.targetType, input.targetId)

    return prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: input.userId,
            targetType: input.targetType,
            targetId: input.targetId,
          },
        },
      })

      const scoreDelta = existingVote ? input.value - existingVote.value : input.value

      const vote = existingVote
        ? await tx.vote.update({
            where: {
              id: existingVote.id,
            },
            data: {
              value: input.value,
            },
          })
        : await tx.vote.create({
            data: {
              userId: input.userId,
              targetType: input.targetType,
              targetId: input.targetId,
              value: input.value,
            },
          })

      const score =
        scoreDelta === 0
          ? await this.getCurrentScore(tx, input.targetType, input.targetId)
          : await this.updateTargetScore(tx, input.targetType, input.targetId, scoreDelta)

      return {
        vote: toDomainVote(vote),
        score,
      }
    })
  }

  async remove(input: RemoveVoteInput): Promise<RemoveVoteResult> {
    await assertTargetExists(input.targetType, input.targetId)

    return prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: input.userId,
            targetType: input.targetType,
            targetId: input.targetId,
          },
        },
      })

      if (!existingVote) {
        return {
          deleted: false,
          score: await this.getCurrentScore(tx, input.targetType, input.targetId),
          currentVote: 0,
        }
      }

      await tx.vote.delete({
        where: {
          id: existingVote.id,
        },
      })

      const score = await this.updateTargetScore(
        tx,
        input.targetType,
        input.targetId,
        -existingVote.value
      )

      return {
        deleted: true,
        score,
        currentVote: 0,
      }
    })
  }

  private async getCurrentScore(
    tx: VoteTransaction,
    targetType: VoteTargetType,
    targetId: string
  ): Promise<number> {
    if (targetType === 'post') {
      const post = await tx.post.findUnique({
        where: { id: targetId },
        select: { score: true },
      })

      if (!post) {
        throw new VoteNotFoundError('투표 대상을 찾을 수 없습니다.')
      }

      return post.score
    }

    const comment = await tx.comment.findUnique({
      where: { id: targetId },
      select: { score: true },
    })

    if (!comment) {
      throw new VoteNotFoundError('투표 대상을 찾을 수 없습니다.')
    }

    return comment.score
  }

  private async updateTargetScore(
    tx: VoteTransaction,
    targetType: VoteTargetType,
    targetId: string,
    scoreDelta: number
  ): Promise<number> {
    if (targetType === 'post') {
      const post = await tx.post.update({
        where: { id: targetId },
        data: toTargetUpdateData(scoreDelta),
        select: { score: true },
      })

      return post.score
    }

    const comment = await tx.comment.update({
      where: { id: targetId },
      data: toTargetUpdateData(scoreDelta),
      select: { score: true },
    })

    return comment.score
  }
}
