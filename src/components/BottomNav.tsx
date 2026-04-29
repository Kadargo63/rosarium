"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, LeafIcon, BarChart2Icon } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const isFeedback = pathname.startsWith('/feedback')
  if (isFeedback) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex">
        {[
          { href: '/', label: 'Home', icon: HomeIcon },
          { href: '/plants', label: 'Plants', icon: LeafIcon },
          { href: '/analytics', label: 'Analytics', icon: BarChart2Icon },
        ].map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${active ? 'text-rose-600' : 'text-neutral-400 hover:text-neutral-600'}`}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
