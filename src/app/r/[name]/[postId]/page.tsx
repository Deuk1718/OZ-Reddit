import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

import { getPostById } from '@/application/use-cases/getPostById'
import { DeletePostButton } from '@/components/feed/DeletePostButton'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'
import { formatRelativeTime } from '@/lib/formatRelativeTime'

type PostDetailPageProps = {
  params: Promise<{
    name: string
    postId: string
  }>
}

const commentPlaceholders = [
  {
    author: 'threadreader',
    createdAt: '32분 전',
    body: '좋은 피드는 결국 제목과 메타의 우선순위를 먼저 정리해두는 게 핵심이라는 점에 공감합니다. 특히 댓글 수와 점수가 어디서 읽히는지가 중요해 보여요.',
  },
  {
    author: 'uxfield',
    createdAt: '17분 전',
    body: '카드에 정보가 많아도 시선이 흐트러지지 않으려면 간격과 계층이 먼저라는 점이 실제 구현에서 큰 차이를 만드는 것 같습니다.',
  },
]

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { name, postId } = await params
  const session = await getServerSession(authOptions)
  const postRepository = new PrismaPostRepository()
  const post = await getPostById(postId, { postRepository }).catch(() => null)

  if (!post || post.subredditName !== name) {
    notFound()
  }

  return (
    <div className='flex w-full flex-col gap-8 pb-8'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]'>
        <article className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_22px_70px_rgba(40,13,140,0.12)] sm:px-8'>
          <Link
            href={`/r/${name}`}
            className='inline-flex text-sm font-semibold text-accent transition hover:text-accent-strong'
          >
            ← r/{name}로 돌아가기
          </Link>

          <div className='mt-6 flex flex-wrap items-center gap-2'>
            <span className='rounded-full bg-highlight-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-deep'>
              Post Detail
            </span>
            <span className='rounded-full border border-accent/14 bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong'>
              r/{post.subredditName}
            </span>
          </div>

          <h1 className='mt-5 max-w-4xl font-display text-5xl tracking-[-0.05em] text-deep'>
            {post.title}
          </h1>

          <div className='mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted'>
            <span className='font-medium text-foreground'>u/{post.authorUsername ?? 'unknown'}</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
            <span>{post.commentCount} comments</span>
          </div>

          <div className='mt-8 grid gap-6 md:grid-cols-[72px_minmax(0,1fr)]'>
            <div className='flex flex-row items-center gap-3 md:flex-col md:items-center'>
              <button
                type='button'
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-strong text-sm font-semibold text-muted transition hover:border-accent hover:text-accent'
                aria-label='추천'
              >
                ▲
              </button>
              <div className='text-center'>
                <p className='text-xl font-semibold tracking-tight text-deep'>{post.score}</p>
                <p className='text-[11px] uppercase tracking-[0.2em] text-muted'>score</p>
              </div>
              <button
                type='button'
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-strong text-sm font-semibold text-muted transition hover:border-accent hover:text-accent'
                aria-label='비추천'
              >
                ▼
              </button>
            </div>

            <div className='rounded-[1.7rem] border border-border bg-surface-strong px-5 py-5'>
              <p className='text-base leading-8 text-foreground'>
                {post.body ?? '본문이 없는 텍스트 게시글입니다.'}
              </p>

              <div className='mt-8 flex flex-wrap gap-3'>
                <button
                  type='button'
                  className='rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.22)] transition hover:bg-accent-strong'
                >
                  댓글 작성
                </button>
                <button
                  type='button'
                  className='rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
                >
                  게시글 공유
                </button>
                {session?.user?.id === post.authorId ? (
                  <DeletePostButton postId={post.id} subredditName={post.subredditName} />
                ) : null}
              </div>
            </div>
          </div>
        </article>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-deep px-6 py-6 text-white shadow-[0_24px_60px_rgba(40,13,140,0.2)]'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-highlight'>
              Discussion Slot
            </p>
            <h2 className='mt-4 font-display text-3xl tracking-[-0.04em]'>댓글 영역 자리</h2>
            <p className='mt-4 text-sm leading-7 text-white/72'>
              M05에서 실제 댓글 작성과 대댓글 흐름이 이 영역 아래에 연결됩니다. 현재는
              본문과 댓글의 시각적 구분을 먼저 확인하는 단계입니다.
            </p>
          </div>

          <div className='rounded-[2rem] border border-border bg-surface px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Meta Panel
            </p>
            <ul className='mt-4 space-y-3 text-sm leading-7 text-muted'>
              <li>서브레딧: r/{post.subredditName}</li>
              <li>작성자: u/{post.authorUsername ?? 'unknown'}</li>
              <li>점수: {post.score}</li>
              <li>댓글 수: {post.commentCount}</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_18px_48px_rgba(40,13,140,0.1)] sm:px-8'>
        <div className='flex items-center justify-between gap-4 border-b border-border pb-5'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Comment Preview
            </p>
            <h2 className='mt-3 font-display text-4xl tracking-[-0.04em] text-deep'>
              댓글 미리보기
            </h2>
          </div>
          <span className='rounded-full bg-highlight-soft px-4 py-2 text-sm font-semibold text-deep'>
            {commentPlaceholders.length} threads
          </span>
        </div>

        <div className='mt-6 space-y-4'>
          {commentPlaceholders.map((comment) => (
            <article
              key={`${comment.author}-${comment.createdAt}`}
              className='rounded-[1.5rem] border border-border bg-surface-strong px-5 py-5'
            >
              <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted'>
                <span className='font-medium text-foreground'>u/{comment.author}</span>
                <span>{comment.createdAt}</span>
              </div>
              <p className='mt-3 text-sm leading-7 text-foreground'>{comment.body}</p>
              <button
                type='button'
                className='mt-4 text-sm font-semibold text-accent transition hover:text-accent-strong'
              >
                답글 달기
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
