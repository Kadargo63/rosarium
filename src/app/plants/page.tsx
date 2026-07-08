export const dynamic = 'force-dynamic'

import { getPlants, getGardens } from '@/lib/queries'
import { PlantCard } from '@/components/PlantCard'
import Link from 'next/link'
import { GROWTH_TYPE_LABELS } from '@/constants'
import type { GrowthType } from '@/types/schema'

const GROWTH_ORDER: GrowthType[] = [
  'hybrid_tea', 'grandiflora', 'floribunda', 'climber',
  'shrub', 'polyantha', 'miniature', 'old_garden',
]

export default async function PlantsPage({
  searchParams,
}: {
  searchParams: { view?: string }
}) {
  const view = searchParams.view === 'type' ? 'type' : 'garden'
  const [plants, gardens] = await Promise.all([getPlants(), getGardens()])

  // By garden grouping
  const byGarden = gardens
    .map((g) => ({ garden: g, plants: plants.filter((p) => p.garden_id === g.id) }))
    .filter((g) => g.plants.length > 0)
  const unassigned = plants.filter((p) => !p.garden_id)

  // By growth type grouping
  const byType = GROWTH_ORDER
    .map((type) => ({
      type,
      label: GROWTH_TYPE_LABELS[type],
      plants: plants.filter((p) => p.rose_entity?.growth_type === type),
    }))
    .filter((g) => g.plants.length > 0)
  const unknownType = plants.filter((p) => !p.rose_entity?.growth_type)

  const viewBtn = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-rose-600 text-white'
          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-rose-900">Plant Inventory</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {viewBtn('/plants?view=garden', 'By Location', view === 'garden')}
            {viewBtn('/plants?view=type', 'By Type', view === 'type')}
          </div>
        </div>
      </div>

      {view === 'garden' && (
        <>
          {byGarden.map(({ garden, plants: gPlants }) => (
            <div key={garden.id}>
              <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                {garden.name} <span className="text-neutral-400 font-normal">({gPlants.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gPlants.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
              </div>
            </div>
          ))}
          {unassigned.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                Unassigned <span className="text-neutral-400 font-normal">({unassigned.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unassigned.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'type' && (
        <>
          {byType.map(({ type, label, plants: tPlants }) => (
            <div key={type}>
              <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                {label} <span className="text-neutral-400 font-normal">({tPlants.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tPlants.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
              </div>
            </div>
          ))}
          {unknownType.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                Unclassified <span className="text-neutral-400 font-normal">({unknownType.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unknownType.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

