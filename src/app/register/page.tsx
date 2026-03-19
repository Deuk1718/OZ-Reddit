import Link from 'next/link'

import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center overflow-auto'>
      <div className='absolute inset-0 z-0'>
        <div 
          className='absolute inset-0 bg-cover bg-center opacity-40 mix-blend-lighten' 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgR-QbUy0jPsXvgfEYwrCytsThBVsOwNZUzgFDzqyCPxV_6c3lPGv6mw4Fv5ZkGqM1iPRLVVVkHZEwu13Sn_9HCoNLAM-taD_EExnhGV5VJC7B26vbQB65aPeNRx6NOro9lasNDNAUX04FPRWeasVpN0I8l4BeQKB3pQ8YXX5jXBPOQW8rpsTjP8tkhtMmFKGdFLwZqlYTdH_oFW3-yfZvp0EuSjDsP2_eZtBodFU2xJ0-7G_aO1iN9vCutcMivowVN6ejFoci2MUI")' }}
        />
        <div className='absolute inset-0 oz-gradient-bg opacity-80'></div>
        <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]'></div>
      </div>

      <div className='relative z-10 mx-4 w-full max-w-2xl py-12 flex flex-col items-center gap-8'>
        <div className='text-center space-y-2'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4'>
            <span className='material-symbols-outlined text-accent text-sm'>auto_awesome</span>
            <span className='text-accent text-xs font-bold uppercase tracking-widest'>Entry Portal Active</span>
          </div>
          <h1 className='text-5xl md:text-7xl font-bold tracking-tight text-white glow-text'>Oz Gateway</h1>
          <p className='text-slate-400 text-lg md:text-xl max-w-lg mx-auto'>
            Your journey through the magical Land of Oz begins with a single step.
          </p>
        </div>

        <div className='glass-card w-full max-w-2xl rounded-xl p-8 md:p-12 shadow-2xl'>
          <RegisterForm />
          <p className='text-center text-slate-500 text-sm mt-8'>
            Already a traveler? <Link href='/login' className='text-accent hover:underline font-medium'>Summon your profile</Link>
          </p>
        </div>

        <div className='flex items-center gap-8 text-slate-500 text-xs font-medium uppercase tracking-[0.2em]'>
          <div className='flex items-center gap-2'>
            <span className='material-symbols-outlined text-base'>verified_user</span>
            Secure Portal
          </div>
          <div className='flex items-center gap-2'>
            <span className='material-symbols-outlined text-base'>public</span>
            Global Oz Access
          </div>
        </div>
      </div>
    </div>
  )
}
