export const dynamic = 'force-dynamic'

import { getGardensWithCounts } from '@/lib/queries'
import { GardenManager } from '@/components/GardenManager'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

export default async function GardensPage() {
  const gardens = await getGardensWithCounts()
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <Link href="/plants" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-3">
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Plants
        </Link>
        <h1 className="text-xl font-bold text-rose-900">Garden Locations</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Add, rename, or remove your garden beds and growing areas.</p>
      </div>
      <GardenManager initialGardens={gardens} />
    </div>
  )
}