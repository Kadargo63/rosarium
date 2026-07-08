import { getPlant, getGardens } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { EditPlantForm } from './EditPlantForm'

export default async function EditPlantPage({ params }: { params: { id: string } }) {
  const [plant, gardens] = await Promise.all([getPlant(params.id), getGardens()])
  if (!plant) notFound()
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href={'/plants/' + params.id} className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-3">
          <ArrowLeftIcon className="w-3.5 h-3.5" /> {plant.label_name}
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">Edit Plant</h1>
      </div>
      <EditPlantForm plant={plant} gardens={gardens} />
    </div>
  )
}