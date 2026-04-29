"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, LeafIcon, BarChart2Icon, PlusIcon } from 'lucide-react'

const links = [
  { href: '/', label: 'Dashboard', icon: HomeIcon },
  { href: '/plants', label: 'Plants', icon: LeafIcon },
  { href: '/analytics', label: 'Analytics', icon: BarChart2Icon },
]

export function SideNav() {
  const pathname = usePathname()
  const isFeedback = pathname.startsWith('/feedback')
  if (isFeedback) return null

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r min-h-screen fixed top-0 left-0">
      <div className="px-5 py-5 border-b">
        <h1 className="text-lg font-bold text-rose-700">🌹 Rosarium</h1>
        <p className="text-xs text-neutral-400">Rose Intelligence</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-rose-50 text-rose-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 pb-4">
        <Link href="/plants/add"
          className="flex items-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors">
          <PlusIcon className="w-4 h-4" /> Add Plant
        </Link>
      </div>
    </aside>
  )
}
