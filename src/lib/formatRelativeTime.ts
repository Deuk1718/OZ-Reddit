export function formatRelativeTime(date: Date): string {
  const diffInMilliseconds = Date.now() - date.getTime()
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))

  if (diffInMinutes < 1) {
    return '방금 전'
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)

  if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  }

  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays < 30) {
    return `${diffInDays}일 전`
  }

  return date.toLocaleDateString('ko-KR')
}
