import {
  normalizeEmail,
  normalizeNickname,
  normalizeUsername,
  validateEmail,
  validateInterests,
  validateNickname,
  validatePassword,
  validateUsername,
} from '@/domain/rules/authRules'
import { hashPassword } from '@/infrastructure/auth/password'

import type { AuthUser } from '@/domain/entities/User'
import type { UserRepository } from '@/application/repositories/UserRepository'

import { AuthConflictError, AuthValidationError } from './authErrors'

export type RegisterUserInput = {
  email: string
  username: string
  nickname: string
  password: string
  interests: string[]
}

type RegisterUserDependencies = {
  userRepository: UserRepository
}

export async function registerUser(
  input: RegisterUserInput,
  dependencies: RegisterUserDependencies
): Promise<AuthUser> {
  const email = normalizeEmail(input.email)
  const username = normalizeUsername(input.username)
  const nickname = normalizeNickname(input.nickname)
  const password = input.password
  const interests = input.interests.map((interest) => interest.trim()).filter(Boolean)

  const fieldErrors = {
    email: validateEmail(email),
    username: validateUsername(username),
    nickname: validateNickname(nickname),
    password: validatePassword(password),
    interests: validateInterests(interests),
  }

  const filteredFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, value]) => value !== null)
  ) as Record<string, string>

  if (Object.keys(filteredFieldErrors).length > 0) {
    throw new AuthValidationError('입력값을 다시 확인해 주세요.', filteredFieldErrors)
  }

  const existingEmailUser = await dependencies.userRepository.findByEmail(email)
  if (existingEmailUser) {
    throw new AuthConflictError('이미 사용 중인 이메일입니다.', 'email')
  }

  const existingUsernameUser = await dependencies.userRepository.findByUsername(username)
  if (existingUsernameUser) {
    throw new AuthConflictError('이미 사용 중인 유저네임입니다.', 'username')
  }

  const passwordHash = await hashPassword(password)

  const user = await dependencies.userRepository.create({
    email,
    username,
    nickname,
    passwordHash,
    interests,
  })

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    interests: user.interests,
  }
}
