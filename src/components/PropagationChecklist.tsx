'use client'
import { useState } from 'react'
import { Scissors, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import type { PropagationStatus } from '@/types/schema'

const CYCLE: PropagationStatus[] = ['none', 'cutting_taken', 'propagated']

const STATUS_CONFIG: Record<PropagationStatus, { label: string; colorClass: string; icon: React.ElementType }> = {
  none: { label: 'No cutting', colorClass: 'text-neutral-400 bg-neutral-100', icon: Circle },
  cutting_taken: { label: 'Cutting taken', colorClass: 'text-amber-700 bg-amber-100', icon: Scissors },
  propagated: { label: 'Propagated', colorClass: 'text-green-700 bg-green-100', icon: CheckCircle2 },
}

export interface PropagationPlant {
  id: string
  label_name: string
  garden_name: string | null
  canonical_name: string
  propagation_status: PropagationStatus
  variety_count: number
}

export function PropagationChecklist({ initialPlants }: { initialPlants: PropagationPlant[] }) {
  const [plants, setPlants] = useState(initialPlants)
  const [updating, setUpdating] = useState<Set<string>>(new Set())

  const cycleStatus = async (plantId: string) => {
    if (updating.has(plantId)) return
    const plant = plants.find((p) => p.id === plantId)
    if (!plant) return

    const nextStatus = CYCLE[(CYCLE.indexOf(plant.propagation_status) + 1) % CYCLE.length]

    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, propagation_status: nextStatus } : p)),
    )
    setUpdating((prev) => {
      const s = new Set(prev)
      s.add(plantId)
      return s
    })

    try {
      const res = await fetch('/api/propagation/' + plantId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
    } catch {
      setPlants((prev) =>
        prev.map((p) => (p.id === plantId ? { ...p, propagation_status: plant.propagation_status } : p)),
      )
    } finally {
      setUpdating((prev) => {
        const s = new Set(prev)
        s.delete(plantId)
        return s
      })
    }
  }

  const total = plants.length
  const propagated = plants.filter((p) => p.propagation_status === 'propagated').length
  const inProgress = plants.filter((p) => p.propagation_status === 'cutting_taken').length
  const notStarted = plants.filter((p) => p.propagation_status === 'none').length
  const pct = total > 0 ? Math.round((propagated / total) * 100) : 0

  const critical = plants.filter((p) => p.variety_count === 1)
  const standard = plants.filter((p) => p.variety_count > 1)

  const sortByStatus = (a: PropagationPlant, b: PropagationPlant) => {
    const order: Record<PropagationStatus, number> = { none: 0, cutting_taken: 1, propagated: 2 }
    return (
      order[a.propagation_status] - order[b.propagation_status] ||
      a.label_name.localeCompare(b.label_name)
    )
  }

  return (
    <div>
      <div className="bg-white rounded-xl border p-4 mb-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">Move readiness</span>
          <span className="text-sm font-bold text-rose-700">{propagated}/{total} propagated</span>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: pct + '%' }}
          />
        </div>
        <div className="flex gap-4 text-xs flex-wrap">
          <span className="text-green-700 font-medium">{propagated} done</span>
          <span className="text-amber-700 font-medium">{inProgress} in progress</span>
          <span className="text-neutral-400">{notStarted} not started</span>
        </div>
      </div>

      {critical.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wide text-red-700">
              Critical — Unique Specimens
            </h2>
            <span className="text-xs text-red-400 font-normal">
              ({critical.filter((p) => p.propagation_status !== 'propagated').length} remaining)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            Only one plant of this variety exists. Clone before you move or it&apos;s gone.
          </p>
          <div className="space-y-2">
            {[...critical].sort(sortByStatus).map((plant) => (
              <PlantRow
                key={plant.id}
                plant={plant}
                isUpdating={updating.has(plant.id)}
                onToggle={cycleStatus}
                isCritical
              />
            ))}
          </div>
        </section>
      )}

      {standard.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-2">
            Standard — Multiple Specimens
          </h2>
          <div className="space-y-2">
            {[...standard].sort(sortByStatus).map((plant) => (
              <PlantRow
                key={plant.id}
                plant={plant}
                isUpdating={updating.has(plant.id)}
                onToggle={cycleStatus}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PlantRow({
  plant,
  isUpdating,
  onToggle,
  isCritical = false,
}: {
  plant: PropagationPlant
  isUpdating: boolean
  onToggle: (id: string) => void
  isCritical?: boolean
}) {
  const config = STATUS_CONFIG[plant.propagation_status]
  const Icon = isUpdating ? Loader2 : config.icon
  const done = plant.propagation_status === 'propagated'

  return (
    <button
      onClick={() => onToggle(plant.id)}
      disabled={isUpdating}
      className={[
        'w-full flex items-center gap-3 p-3.5 rounded-xl border bg-white',
        'active:scale-[0.98] transition-transform text-left select-none',
        isCritical && !done ? 'border-red-200 bg-red-50/40' : 'border-neutral-200',
        done ? 'opacity-60' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={'flex-shrink-0 p-1.5 rounded-lg ' + config.colorClass}>
        <Icon className={'w-4 h-4' + (isUpdating ? ' animate-spin' : '')} />
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={
            'text-sm font-medium truncate ' +
            (done ? 'line-through text-neutral-400' : 'text-neutral-800')
          }
        >
          {plant.label_name}
        </p>
        <p className="text-xs text-neutral-400 truncate">
          {plant.canonical_name} &middot; {plant.garden_name ?? 'Unassigned'}
        </p>
      </div>
      <span className={'flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ' + config.colorClass}>
        {config.label}
      </span>
    </button>
  )
}