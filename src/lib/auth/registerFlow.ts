export const REGISTER_DRAFT_STORAGE_KEY = 'oz-reddit-register-draft'

export const INTEREST_OPTIONS = [
  '게임',
  '기술',
  '영화',
  '음악',
  '스포츠',
  '패션',
  '음식',
  '여행',
  '독서',
  '사진',
  '반려동물',
  '과학',
] as const

export type RegisterDraft = {
  email: string
  username: string
  nickname: string
  password: string
  confirmPassword: string
  interests: string[]
}

export const EMPTY_REGISTER_DRAFT: RegisterDraft = {
  email: '',
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  interests: [],
}
