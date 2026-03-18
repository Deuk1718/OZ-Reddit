import { NextResponse } from 'next/server'

import { PrismaUserRepository } from '@/infrastructure/db/repositories/PrismaUserRepository'
import { registerUser } from '@/application/use-cases/registerUser'
import { AuthConflictError, AuthValidationError } from '@/application/use-cases/authErrors'

type RegisterRequestBody = {
  email?: string
  username?: string
  nickname?: string
  password?: string
  interests?: unknown
}

function isRegisterRequestBody(value: unknown): value is RegisterRequestBody {
  return typeof value === 'object' && value !== null
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!isRegisterRequestBody(body)) {
    return NextResponse.json(
      { message: '요청 본문이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  try {
    const userRepository = new PrismaUserRepository()
    const user = await registerUser(
      {
        email: body.email ?? '',
        username: body.username ?? '',
        nickname: body.nickname ?? '',
        password: body.password ?? '',
        interests: Array.isArray(body.interests)
          ? body.interests.filter((value): value is string => typeof value === 'string')
          : [],
      },
      { userRepository }
    )

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof AuthValidationError) {
      return NextResponse.json(
        {
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: 400 }
      )
    }

    if (error instanceof AuthConflictError) {
      return NextResponse.json(
        {
          message: error.message,
          field: error.field,
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
