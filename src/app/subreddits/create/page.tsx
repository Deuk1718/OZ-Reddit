import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { CreateSubredditForm } from '@/components/subreddits/CreateSubredditForm'
import { authOptions } from '@/infrastructure/auth/authOptions'

export default async function CreateSubredditPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login?callbackUrl=/subreddits/create')
  }

  return (
    <section className='mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(520px,1fr)]'>
      <div className='rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(74,48,242,0.96),rgba(40,13,140,0.98))] p-8 text-white shadow-[0_24px_80px_rgba(40,13,140,0.24)]'>
        <p className='inline-flex rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-highlight'>
          Create Community
        </p>
        <h1 className='mt-6 font-display text-5xl tracking-[-0.04em]'>
          새로운 대화의 공간을 직접 시작하세요
        </h1>
        <p className='mt-5 text-sm leading-7 text-white/78'>
          서브레딧은 같은 관심사를 가진 사람들이 모여 대화를 이어가는 기본 단위입니다.
          이름은 짧고 분명하게, 설명은 어떤 글이 잘 맞는지 알 수 있도록 쓰는 편이 좋습니다.
        </p>
      </div>

      <div className='flex flex-col gap-6 rounded-[2rem] border border-border bg-surface p-8 shadow-[0_20px_70px_rgba(40,13,140,0.12)]'>
        <div>
          <p className='text-sm font-medium uppercase tracking-[0.2em] text-accent'>
            M02 서브레딧
          </p>
          <h2 className='mt-3 text-3xl font-semibold tracking-tight text-foreground'>
            서브레딧 만들기
          </h2>
          <p className='mt-3 text-sm leading-6 text-muted'>
            이름과 설명을 입력해 커뮤니티를 생성합니다. 생성 후에는 상세 페이지로 바로
            이동합니다.
          </p>
        </div>

        <CreateSubredditForm />
      </div>
    </section>
  )
}
