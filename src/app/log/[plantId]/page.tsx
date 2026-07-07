import { getPlant } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { LogForm } from './LogForm'

export default async function LogEntryPage({ params }: { params: { plantId: string } }) {
  const plant = await getPlant(params.plantId)
  if (!plant) notFound()

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href={'/plants/' + plant.id} className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-3">
          <ArrowLeftIcon className="w-3.5 h-3.5" /> {plant.label_name}
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">Add Log</h1>
        <p className="text-sm text-neutral-500 mt-0.5">{plant.label_name}</p>
      </div>
      <LogForm plantId={plant.id} />
    </div>
  )
}