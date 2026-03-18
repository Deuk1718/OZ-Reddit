import Link from 'next/link'

import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <section className='mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)]'>
      <div className='rounded-[2rem] border border-border bg-deep p-8 text-white shadow-[0_24px_80px_rgba(40,13,140,0.24)]'>
        <p className='inline-flex rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-highlight'>
          Welcome Back
        </p>
        <h1 className='mt-6 font-display text-5xl tracking-[-0.04em]'>대화의 흐름으로 다시 돌아오세요</h1>
        <p className='mt-5 text-sm leading-7 text-white/74'>
          OZ-Reddit는 빠른 피드 탐색과 깊이 있는 토론이 자연스럽게 이어지는 커뮤니티를
          지향합니다. 로그인 후 바로 관심 커뮤니티와 최근 대화로 이어집니다.
        </p>
        <div className='mt-8 space-y-3'>
          <div className='rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-highlight'>
              Fast Re-entry
            </p>
            <p className='mt-2 text-sm leading-6 text-white/74'>
              최근 활동하던 커뮤니티와 토론 흐름을 끊기지 않게 이어갑니다.
            </p>
          </div>
          <div className='rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-highlight'>
              Clean Signal
            </p>
            <p className='mt-2 text-sm leading-6 text-white/74'>
              구조가 명확한 피드와 메타 정보로 읽기 쉬운 경험을 유지합니다.
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-6 rounded-[2rem] border border-border bg-surface p-8 shadow-[0_20px_70px_rgba(40,13,140,0.12)]'>
        <div>
          <p className='text-sm font-medium uppercase tracking-[0.2em] text-accent'>M01 인증</p>
          <h2 className='mt-3 text-3xl font-semibold tracking-tight text-foreground'>로그인</h2>
          <p className='mt-3 text-sm leading-6 text-muted'>
            이메일과 비밀번호로 로그인하고 세션을 시작합니다.
          </p>
        </div>

        <LoginForm />

        <p className='text-sm text-muted'>
          아직 계정이 없다면{' '}
          <Link href='/register' className='font-semibold text-accent-strong'>
            회원가입
          </Link>
          으로 이동하세요.
        </p>
      </div>
    </section>
  )
}
