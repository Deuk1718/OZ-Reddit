import { normalizeEmail, validateEmail, validatePassword } from '@/domain/rules/authRules'
import { verifyPassword } from '@/infrastructure/auth/password'

import type { AuthUser } from '@/domain/entities/User'
import type { UserRepository } from '@/application/repositories/UserRepository'

import { AuthenticationError, AuthValidationError } from './authErrors'

export type AuthenticateUserInput = {
  email: string
  password: string
}

type AuthenticateUserDependencies = {
  userRepository: UserRepository
}

export async function authenticateUser(
  input: AuthenticateUserInput,
  dependencies: AuthenticateUserDependencies
): Promise<AuthUser> {
  const email = normalizeEmail(input.email)
  const password = input.password

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  }

  const filteredFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, value]) => value !== null)
  ) as Record<string, string>

  if (Object.keys(filteredFieldErrors).length > 0) {
    throw new AuthValidationError('입력값을 다시 확인해 주세요.', filteredFieldErrors)
  }

  const user = await dependencies.userRepository.findByEmail(email)

  if (!user) {
    throw new AuthenticationError('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash)

  if (!isPasswordValid) {
    throw new AuthenticationError('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    nickname: user.nickname,
    interests: user.interests,
  }
}
