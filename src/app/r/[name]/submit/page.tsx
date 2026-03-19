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
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6'>
      <section className='grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_340px]'>
        <div className='glass-card px-6 py-7 sm:px-8'>
          <Link
            href={`/r/${name}`}
            className='inline-flex items-center gap-1 text-sm font-semibold text-accent transition hover:text-secondary'
          >
            <span className='material-symbols-outlined text-[16px]'>arrow_back</span>
            z/{name} 피드로 돌아가기
          </Link>

          <div className='mt-6'>
            <p className='inline-flex rounded-full bg-accent-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-accent'>
              Create Post
            </p>
            <h1 className='mt-6 text-3xl font-bold tracking-tight text-deep sm:text-4xl'>
              z/{name}에 새 글 쓰기
            </h1>
            <p className='mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base'>
              {community.description} 이 커뮤니티에 맞는 질문, 회고, 인사이트를
              작성해 보세요.
            </p>
          </div>

          {session?.user ? (
            <>
              <CreatePostForm subredditName={name} />
              <div className='mt-4'>
                <Link
                  href={`/r/${name}`}
                  className='rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent'
                >
                  초안 취소
                </Link>
              </div>
            </>
          ) : (
            <div className='glass-card-strong mt-8 px-5 py-5'>
              <p className='text-sm font-semibold text-deep'>게시글 작성은 로그인 후 가능합니다.</p>
              <p className='mt-3 text-sm leading-7 text-muted'>
                계정에 로그인한 뒤 이 커뮤니티에 바로 글을 남길 수 있습니다.
              </p>
              <Link
                href={`/login?callbackUrl=/r/${name}/submit`}
                className='btn-gradient mt-5 inline-flex px-5 py-3 text-sm'
              >
                로그인하고 작성하기
              </Link>
            </div>
          )}
        </div>

        <aside className='flex flex-col gap-6'>
          <div className='glass-card px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-secondary'>
              Writing Guide
            </p>
            <h2 className='mt-4 text-2xl font-bold tracking-tight text-deep'>
              잘 읽히는 글의 구조
            </h2>
            <ul className='mt-6 space-y-3 text-sm leading-7 text-muted'>
              {writingGuides.map((guide) => (
                <li
                  key={guide}
                  className='glass-card-strong px-4 py-3'
                >
                  {guide}
                </li>
              ))}
            </ul>
          </div>

          <div className='glass-card px-6 py-6'>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-accent'>
              Flow Note
            </p>
            <ul className='mt-4 space-y-3 text-sm leading-7 text-muted'>
              <li className='flex items-center gap-2'>
                <span className='material-symbols-outlined text-[14px] text-accent'>chevron_right</span>
                피드에서 작성 페이지로 진입
              </li>
              <li className='flex items-center gap-2'>
                <span className='material-symbols-outlined text-[14px] text-accent'>chevron_right</span>
                작성 후 상세 페이지로 이동
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}
