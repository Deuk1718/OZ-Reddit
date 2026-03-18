import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono, Manrope } from 'next/font/google'

import { AppHeader } from '@/components/layout/AppHeader'
import { SessionProvider } from '@/components/providers/SessionProvider'

import './globals.css'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
})

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'OZ-Reddit Community',
  description: '정돈된 구조와 선명한 콘텐츠 밀도를 가진 커뮤니티 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body
        className={`${manrope.variable} ${fraunces.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <SessionProvider>
          <div className='min-h-screen bg-background text-foreground'>
            <AppHeader />
            <main className='mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8'>
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
