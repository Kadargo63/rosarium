"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, LeafIcon, BarChart2Icon, Scissors, PlusIcon } from 'lucide-react'
import { useRosariumStore } from '@/store/useStore'

export function BottomNav() {
  const pathname = usePathname()
  const openQuickAdd = useRosariumStore((s) => s.openQuickAdd)
  const isFeedback = pathname.startsWith('/feedback')
  if (isFeedback) return null

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/plants', label: 'Plants', icon: LeafIcon },
    null, // FAB placeholder
    { href: '/propagation', label: 'Propagate', icon: Scissors },
    { href: '/analytics', label: 'Analytics', icon: BarChart2Icon },
  ] as const

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex items-end">
        {navLinks.map((item, i) => {
          if (!item) {
            return (
              <button key="fab" onClick={openQuickAdd}
                className="flex-1 flex flex-col items-center pb-2">
                <span className="w-12 h-12 bg-rose-600 hover:bg-rose-700 rounded-full flex items-center justify-center shadow-lg -mt-5 transition-colors">
                  <PlusIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </span>
                <span className="text-xs text-rose-500 mt-0.5 font-medium">Add</span>
              </button>
            )
          }
          const { href, label, icon: Icon } = item
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${
                active ? 'text-rose-600' : 'text-neutral-400 hover:text-neutral-600'
              }`}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
