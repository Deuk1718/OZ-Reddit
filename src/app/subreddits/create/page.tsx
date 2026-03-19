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
    <section className='mx-auto grid w-full max-w-4xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(400px,1fr)]'>
      <div className='glass-card relative overflow-hidden p-8'>
        <div className='absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(159,31,239,0.25),transparent_50%)]' />
        <div className='relative'>
          <p className='inline-flex rounded-full bg-secondary-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-secondary'>
            Create Community
          </p>
          <h1 className='mt-6 text-3xl font-bold tracking-tight text-deep'>
            새로운 대화의 공간을 직접 시작하세요
          </h1>
          <p className='mt-5 text-sm leading-7 text-muted'>
            서브레딧은 같은 관심사를 가진 사람들이 모여 대화를 이어가는 기본 단위입니다.
            이름은 짧고 분명하게, 설명은 어떤 글이 잘 맞는지 알 수 있도록 쓰는 편이 좋습니다.
          </p>
        </div>
      </div>

      <div className='glass-card flex flex-col gap-6 p-8'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-widest text-accent'>
            서브레딧
          </p>
          <h2 className='mt-3 text-2xl font-bold tracking-tight text-deep'>
            서브레딧 만들기
          </h2>
          <p className='mt-3 text-sm leading-6 text-muted'>
            이름과 설명을 입력해 커뮤니티를 생성합니다.
          </p>
        </div>

        <CreateSubredditForm />
      </div>
    </section>
  )
}
