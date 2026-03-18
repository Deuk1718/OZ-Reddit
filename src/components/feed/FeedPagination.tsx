import Link from 'next/link'

type FeedPaginationProps = {
  basePath: string
  sort: 'hot' | 'new'
  currentCursor?: string
  nextCursor: string | null
}

function parseCursor(cursor?: string): number {
  if (!cursor) {
    return 0
  }

  const value = Number.parseInt(cursor, 10)
  return Number.isNaN(value) || value < 0 ? 0 : value
}

export function FeedPagination({
  basePath,
  sort,
  currentCursor,
  nextCursor,
}: FeedPaginationProps) {
  const currentOffset = parseCursor(currentCursor)
  const previousCursor =
    currentOffset > 0 ? String(Math.max(0, currentOffset - 10)) : null

  if (!previousCursor && !nextCursor) {
    return null
  }

  return (
    <div className='mt-6 flex items-center justify-end gap-3'>
      {previousCursor ? (
        <Link
          href={`${basePath}?sort=${sort}&cursor=${previousCursor}`}
          className='rounded-full border border-border bg-surface-strong px-5 py-3 text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
        >
          이전 페이지
        </Link>
      ) : null}

      {nextCursor ? (
        <Link
          href={`${basePath}?sort=${sort}&cursor=${nextCursor}`}
          className='rounded-full border border-border bg-surface-strong px-5 py-3 text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
        >
          다음 페이지
        </Link>
      ) : null}
    </div>
  )
}
