import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

import { getComments } from '@/application/use-cases/getComments'
import { getPostById } from '@/application/use-cases/getPostById'
import { CommentComposer } from '@/components/comments/CommentComposer'
import { CommentThreadList } from '@/components/comments/CommentThreadList'
import { DeletePostButton } from '@/components/feed/DeletePostButton'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaCommentRepository } from '@/infrastructure/db/repositories/PrismaCommentRepository'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'
import { formatRelativeTime } from '@/lib/formatRelativeTime'

type PostDetailPageProps = {
  params: Promise<{
    name: string
    postId: string
  }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { name, postId } = await params
  const session = await getServerSession(authOptions)
  const postRepository = new PrismaPostRepository()
  const commentRepository = new PrismaCommentRepository()
  const post = await getPostById(postId, { postRepository }).catch(() => null)
  const comments = post
    ? await getComments(
        {
          postId: post.id,
        },
        { commentRepository, postRepository }
      ).catch(() => [])
    : []

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
                <a
                  href='#comment-preview'
                  className='rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.22)] transition hover:bg-accent-strong'
                >
                  댓글 영역 보기
                </a>
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
              Discussion
            </p>
            <h2 className='mt-4 font-display text-3xl tracking-[-0.04em]'>댓글 흐름</h2>
            <p className='mt-4 text-sm leading-7 text-white/72'>
              댓글 작성, 답글, 삭제 흐름이 상세 페이지와 연결되었습니다. 한 단계 대댓글까지만
              허용해 대화 계층을 단순하게 유지합니다.
            </p>
            <div className='mt-6 rounded-[1.5rem] border border-white/14 bg-white/8 px-4 py-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-white/58'>
                Comment Rules
              </p>
              <p className='mt-3 text-sm leading-7 text-white/80'>
                최신순 정렬로 표시되며, 대댓글에는 다시 답글을 달 수 없습니다. 삭제는 작성자
                본인만 가능합니다.
              </p>
            </div>
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

      <section
        id='comment-preview'
        className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_18px_48px_rgba(40,13,140,0.1)] sm:px-8'
      >
        <div className='flex items-center justify-between gap-4 border-b border-border pb-5'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Comment Preview
            </p>
            <h2 className='mt-3 font-display text-4xl tracking-[-0.04em] text-deep'>
              댓글
            </h2>
          </div>
          <span className='rounded-full bg-highlight-soft px-4 py-2 text-sm font-semibold text-deep'>
            {post.commentCount} threads
          </span>
        </div>

        <div className='mt-6 rounded-[1.5rem] border border-border bg-surface-strong px-5 py-5'>
          {session?.user?.id ? (
            <CommentComposer
              postId={post.id}
              submitLabel='댓글 등록'
              placeholder='이 게시글에 대한 의견을 남겨 보세요'
            />
          ) : (
            <div className='flex flex-col gap-3'>
              <p className='text-sm font-semibold text-deep'>댓글을 남기려면 로그인이 필요합니다.</p>
              <p className='text-sm leading-7 text-muted'>
                로그인 후 댓글과 대댓글을 작성할 수 있습니다.
              </p>
              <Link
                href={`/login?callbackUrl=/r/${name}/${post.id}`}
                className='inline-flex w-fit rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.22)] transition hover:bg-accent-strong'
              >
                로그인하러 가기
              </Link>
            </div>
          )}
        </div>

        <div className='mt-6'>
          <CommentThreadList
            comments={comments}
            currentUserId={session?.user?.id ?? null}
            postId={post.id}
          />
        </div>
      </section>
    </div>
  )
}
