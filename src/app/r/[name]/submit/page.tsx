import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

import { getSubredditByName } from '@/application/use-cases/getSubredditByName'
import { CreatePostForm } from '@/components/feed/CreatePostForm'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaSubredditRepository } from '@/infrastructure/db/repositories/PrismaSubredditRepository'

type SubmitPostPageProps = {
  params: Promise<{
    name: string
  }>
}

const writingGuides = [
  '제목은 무엇을 논의하고 싶은지 한 문장으로 먼저 보여줘야 합니다.',
  '본문은 현재 맥락, 시도한 것, 원하는 피드백 순서로 짧게 정리하는 편이 좋습니다.',
  '스크롤을 길게 늘리기보다 읽는 사람이 바로 반응할 수 있게 핵심만 남깁니다.',
]

export default async function SubmitPostPage({ params }: SubmitPostPageProps) {
  const { name } = await params
  const session = await getServerSession(authOptions)
  const subredditRepository = new PrismaSubredditRepository()
  const community = await getSubredditByName(name, { subredditRepository }).catch(
    () => null
  )

  if (!community) {
    notFound()
  }

  return (
    <div className='flex w-full flex-col gap-8 pb-8'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]'>
        <div className='rounded-[2rem] border border-border bg-surface px-6 py-7 shadow-[0_22px_70px_rgba(40,13,140,0.12)] sm:px-8'>
          <Link
            href={`/r/${name}`}
            className='inline-flex text-sm font-semibold text-accent transition hover:text-accent-strong'
          >
            ← r/{name} 피드로 돌아가기
          </Link>

          <div className='mt-6'>
            <p className='inline-flex rounded-full border border-accent/20 bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong'>
              Create Post
            </p>
            <h1 className='mt-6 font-display text-5xl tracking-[-0.05em] text-deep'>
              r/{name}에 새 글 쓰기
            </h1>
            <p className='mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base'>
              {community.description} 이 커뮤니티에 맞는 질문, 회고, 인사이트를
              작성해 보세요. 현재는 실제 저장 로직과 유효성 검증이 연결된 상태입니다.
            </p>
          </div>

          {session?.user ? (
            <>
              <CreatePostForm subredditName={name} />
              <div className='mt-4'>
                <Link
                  href={`/r/${name}`}
                  className='rounded-full border border-border bg-surface-strong px-5 py-3 text-sm font-semibold text-deep transition hover:border-accent hover:text-accent'
                >
                  초안 취소
                </Link>
              </div>
            </>
          ) : (
            <div className='mt-8 rounded-[1.7rem] border border-border bg-surface-strong px-5 py-5'>
              <p className='text-sm font-semibold text-deep'>게시글 작성은 로그인 후 가능합니다.</p>
              <p className='mt-3 text-sm leading-7 text-muted'>
                계정에 로그인한 뒤 이 커뮤니티에 바로 글을 남길 수 있습니다.
              </p>
              <Link
                href={`/login?callbackUrl=/r/${name}/submit`}
                className='mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(74,48,242,0.24)] transition hover:bg-accent-strong'
              >
                로그인하고 작성하기
              </Link>
            </div>
          )}
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='rounded-[2rem] border border-border bg-deep px-6 py-6 text-white shadow-[0_24px_60px_rgba(40,13,140,0.2)]'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-highlight'>
              Writing Guide
            </p>
            <h2 className='mt-4 font-display text-3xl tracking-[-0.04em]'>
              잘 읽히는 글의 구조
            </h2>
            <ul className='mt-6 space-y-3 text-sm leading-7 text-white/72'>
              {writingGuides.map((guide) => (
                <li
                  key={guide}
                  className='rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3'
                >
                  {guide}
                </li>
              ))}
            </ul>
          </div>

          <div className='rounded-[2rem] border border-border bg-surface px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Flow Note
            </p>
            <ul className='mt-4 space-y-3 text-sm leading-7 text-muted'>
              <li>피드에서 작성 페이지로 진입</li>
              <li>작성 후 피드 카드 또는 상세 페이지로 연결</li>
              <li>M03에서 실제 저장 성공 시 상세 페이지 이동 처리 예정</li>
            </ul>
          </div>

          <div className='rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(236,242,48,0.22),rgba(255,255,255,0.96))] px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-strong'>
              Next Step
            </p>
            <p className='mt-4 text-sm leading-7 text-deep'>
              다음에는 이 페이지에 실제 유효성 검증과 저장 API를 붙여 M03 작성 플로우를
              완성하면 됩니다.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
