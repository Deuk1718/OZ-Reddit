import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'

import { AppHeader } from '@/components/layout/AppHeader'
import { MagicCursor } from '@/components/layout/MagicCursor'
import { SessionProvider } from '@/components/providers/SessionProvider'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'OZ-Reddit Community',
  description: 'Your journey through the magical Land of Oz begins here.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko' className='dark'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
          rel='stylesheet'
        />
      </head>
      <body className={`${spaceGrotesk.variable} font-sans antialiased text-slate-100 min-h-screen bg-background`}>
        <SessionProvider>
          <MagicCursor />
          <div className='relative flex flex-col min-h-screen'>
            <AppHeader />
            <div className='flex-1 w-full'>
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
