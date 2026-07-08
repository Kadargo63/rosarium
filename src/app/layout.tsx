import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { BottomNav } from '@/components/BottomNav'
import { SideNav } from '@/components/SideNav'
import { QuickAddButton } from '@/components/QuickAddButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rosarium',
  description: 'Precision rose intelligence system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-neutral-50">
          <SideNav />
          <main className="flex-1 pb-20 md:pb-0 md:pl-56">
            <div className="max-w-5xl mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
        <BottomNav />
        <QuickAddButton />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
