const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/

export const MIN_PASSWORD_LENGTH = 8
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 30
export const MIN_NICKNAME_LENGTH = 2
export const MAX_NICKNAME_LENGTH = 20
export const MAX_INTERESTS_COUNT = 5

export function validateEmail(email: string): string | null {
  if (!EMAIL_REGEX.test(email)) {
    return '올바른 이메일 형식이 아닙니다.'
  }

  return null
}

export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`
  }

  return null
}

export function validateUsername(username: string): string | null {
  if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
    return `유저네임은 ${MIN_USERNAME_LENGTH}자 이상 ${MAX_USERNAME_LENGTH}자 이하여야 합니다.`
  }

  if (!USERNAME_REGEX.test(username)) {
    return '유저네임은 영문, 숫자, 언더스코어만 사용할 수 있습니다.'
  }

  return null
}

export function validateNickname(nickname: string): string | null {
  if (nickname.length < MIN_NICKNAME_LENGTH || nickname.length > MAX_NICKNAME_LENGTH) {
    return `닉네임은 ${MIN_NICKNAME_LENGTH}자 이상 ${MAX_NICKNAME_LENGTH}자 이하여야 합니다.`
  }

  return null
}

export function validateInterests(interests: string[]): string | null {
  if (interests.length > MAX_INTERESTS_COUNT) {
    return `관심사는 최대 ${MAX_INTERESTS_COUNT}개까지 선택할 수 있습니다.`
  }

  return null
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizeUsername(username: string): string {
  return username.trim()
}

export function normalizeNickname(nickname: string): string {
  return nickname.trim()
}
