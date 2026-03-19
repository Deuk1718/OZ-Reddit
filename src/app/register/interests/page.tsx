import { InterestPicker } from '@/components/auth/InterestPicker'

export default function RegisterInterestsPage() {
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
      
      <div className='relative z-10 mx-4 w-full max-w-4xl py-12'>
        <InterestPicker />
      </div>
    </div>
  )
}
