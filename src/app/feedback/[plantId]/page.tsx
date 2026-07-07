import { getPlant } from '@/lib/queries'
import { notFound } from 'next/navigation'
import { FeedbackForm } from '@/components/FeedbackForm'

export default async function FeedbackPage({ params }: { params: { plantId: string } }) {
  const plant = await getPlant(params.plantId)
  if (!plant) notFound()

  return (
    <div className="min-h-screen bg-neutral-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-2">🌹</div>
          <h1 className="text-2xl font-bold text-rose-900">{plant.label_name}</h1>
          {plant.rose_entity && plant.rose_entity.canonical_name !== plant.label_name && (
            <p className="text-sm text-neutral-500 mt-0.5">{plant.rose_entity.canonical_name}</p>
          )}
          {plant.garden && <p className="text-xs text-neutral-400 mt-1">{plant.garden.name}</p>}
          <p className="text-sm text-neutral-500 mt-3">Share your observations about this rose</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <FeedbackForm plantId={plant.id} />
        </div>
      </div>
    </div>
  )
}