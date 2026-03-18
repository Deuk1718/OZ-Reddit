import Link from 'next/link'

import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <section className='mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(520px,1fr)]'>
      <div className='rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(74,48,242,0.96),rgba(40,13,140,0.98))] p-8 text-white shadow-[0_24px_80px_rgba(40,13,140,0.24)]'>
        <p className='inline-flex rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-highlight'>
          Join The Community
        </p>
        <h1 className='mt-6 font-display text-5xl tracking-[-0.04em]'>첫 취향부터 커뮤니티 경험을 맞춰 시작합니다</h1>
        <p className='mt-5 text-sm leading-7 text-white/78'>
          유저네임, 닉네임, 관심사를 먼저 정리해 두면 홈 피드와 추천 커뮤니티가 더 빠르게
          개인화됩니다.
        </p>
        <div className='mt-8 grid gap-3'>
          <div className='rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-highlight'>
              Identity
            </p>
            <p className='mt-2 text-sm leading-6 text-white/74'>
              유저네임과 닉네임은 프로필과 댓글 대화의 기본 톤을 만듭니다.
            </p>
          </div>
          <div className='rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-highlight'>
              Interests
            </p>
            <p className='mt-2 text-sm leading-6 text-white/74'>
              관심사를 먼저 선택해 피드를 더 빠르게 시작할 수 있도록 준비합니다.
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-6 rounded-[2rem] border border-border bg-surface p-8 shadow-[0_20px_70px_rgba(40,13,140,0.12)]'>
        <div>
          <p className='text-sm font-medium uppercase tracking-[0.2em] text-accent'>M01 인증</p>
          <h2 className='mt-3 text-3xl font-semibold tracking-tight text-foreground'>회원가입</h2>
          <p className='mt-3 text-sm leading-6 text-muted'>
            이메일, 유저네임, 닉네임, 관심사를 입력해 커뮤니티 시작 프로필을 준비합니다.
          </p>
        </div>

        <RegisterForm />

        <p className='text-sm text-muted'>
          이미 계정이 있다면{' '}
          <Link href='/login' className='font-semibold text-accent-strong'>
            로그인
          </Link>
          으로 이동하세요.
        </p>
      </div>
    </section>
  )
}
