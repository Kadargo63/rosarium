export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { getPlant, getLogsByPlant, getPhotosByPlant, getFeedbackByPlant } from '@/lib/queries'
import { LogTimeline } from '@/components/LogTimeline'
import { PhotoGallery } from '@/components/PhotoGallery'
import { FeedbackPanel } from '@/components/FeedbackPanel'
import { PlantAnalyticsStrip } from '@/components/PlantAnalyticsStrip'
import { ArsLabel } from '@/components/ArsLabel'
import { ShareButton } from '@/components/ShareButton'
import { Badge } from '@/components/ui/badge'
import { GROWTH_TYPE_LABELS, COLOR_CODE_LABELS, PRUNING_MODEL_LABELS } from '@/constants'

export default async function PlantDetailPage({ params }: { params: { id: string } }) {
  const [plant, logs, photos, feedback] = await Promise.all([
    getPlant(params.id),
    getLogsByPlant(params.id),
    getPhotosByPlant(params.id),
    getFeedbackByPlant(params.id),
  ])

  if (!plant) notFound()

  const rose = plant.rose_entity

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/plants" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-3">
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Plants
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-neutral-900 truncate">{plant.label_name}</h1>
            {rose && rose.canonical_name !== plant.label_name && (
              <p className="text-sm text-neutral-500">{rose.canonical_name}</p>
            )}
            {plant.garden && <p className="text-xs text-neutral-400 mt-0.5">{plant.garden.name}</p>}
          </div>
          <ShareButton plant={plant} />
        </div>
        {rose && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <ArsLabel rose={rose} />
            {rose.growth_type && (
              <Badge variant="outline" className="text-xs">{GROWTH_TYPE_LABELS[rose.growth_type]}</Badge>
            )}
            {rose.color_code && (
              <Badge variant="outline" className="text-xs">{COLOR_CODE_LABELS[rose.color_code] ?? rose.color_code}</Badge>
            )}
            {rose.pruning_model && (
              <Badge variant="outline" className="text-xs">{PRUNING_MODEL_LABELS[rose.pruning_model]}</Badge>
            )}
            {rose.year_introduced && (
              <Badge variant="outline" className="text-xs">Est. {rose.year_introduced}</Badge>
            )}
            {rose.country_of_origin && (
              <Badge variant="outline" className="text-xs">{rose.country_of_origin}</Badge>
            )}
          </div>
        )}
      </div>

      <PlantAnalyticsStrip logs={logs} />
      <PhotoGallery photos={photos} logs={logs} />
      <LogTimeline logs={logs} plantId={plant.id} />
      <FeedbackPanel feedback={feedback} plantId={plant.id} />
    </div>
  )
}