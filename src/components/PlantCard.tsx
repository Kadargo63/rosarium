'use client'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArsLabel } from './ArsLabel'
import type { PlantWithDetails } from '@/types/schema'
import { PRUNING_MODEL_COLORS, PRUNING_MODEL_LABELS } from '@/constants'
import { ClipboardListIcon } from 'lucide-react'

interface Props { plant: PlantWithDetails }

export function PlantCard({ plant }: Props) {
  const rose = plant.rose_entity
  const pruningColor = rose?.pruning_model ? PRUNING_MODEL_COLORS[rose.pruning_model] : ''
  const daysSinceLog = plant.latest_log
    ? Math.floor((Date.now() - new Date(plant.latest_log.date).getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <Link href={`/plants/${plant.id}`}>
      <Card className="hover:border-rose-300 hover:bg-rose-50/30 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm text-neutral-900 truncate">{plant.label_name}</p>
              {rose && rose.canonical_name !== plant.label_name && (
                <p className="text-xs text-neutral-400 truncate">{rose.canonical_name}</p>
              )}
            </div>
            <Link href={`/log/${plant.id}`} onClick={(e) => e.stopPropagation()}
              className="shrink-0 p-1.5 rounded-md text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              title="Add log">
              <ClipboardListIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {rose && <ArsLabel rose={rose} />}
            {rose?.pruning_model && (
              <Badge className={`text-xs ${pruningColor}`}>
                {PRUNING_MODEL_LABELS[rose.pruning_model]}
              </Badge>
            )}
          </div>
          {plant.latest_log && (
            <div className="flex gap-3 mt-2 text-xs text-neutral-500">
              <span>V:{plant.latest_log.vigor ?? '—'}</span>
              <span>H:{plant.latest_log.health ?? '—'}</span>
              <span className={daysSinceLog && daysSinceLog > 9 ? 'text-amber-500' : ''}>
                {daysSinceLog === 0 ? 'Today' : daysSinceLog === 1 ? '1d ago' : `${daysSinceLog}d ago`}
              </span>
            </div>
          )}
          {!plant.latest_log && (
            <p className="text-xs text-neutral-400 mt-2 italic">No logs yet</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
