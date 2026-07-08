export const dynamic = 'force-dynamic'

import { getActiveBatches } from '@/lib/queries'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { BatchDashboard } from './BatchDashboard'

export default async function BatchesPage() {
  const batches = await getActiveBatches() as Record<string, unknown>[]
  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <Link href="/propagation" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-3">
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Propagation
        </Link>
        <h1 className="text-xl font-bold text-rose-900">Cutting Batches</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Track your active cutting batches. Update viability counts as weeks pass.
        </p>
      </div>
      <BatchDashboard initialBatches={batches} />
    </div>
  )
}