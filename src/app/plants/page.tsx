export const dynamic = 'force-dynamic'

import { getPlants, getGardens } from '@/lib/queries'
import { PlantCard } from '@/components/PlantCard'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function PlantsPage() {
  const [plants, gardens] = await Promise.all([getPlants(), getGardens()])

  const byGarden = gardens.map((g) => ({
    garden: g,
    plants: plants.filter((p) => p.garden_id === g.id),
  })).filter((g) => g.plants.length > 0)

  const unassigned = plants.filter((p) => !p.garden_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-rose-900">Plant Inventory</h1>
        <Link href="/plants/add">
          <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Plant
          </Button>
        </Link>
      </div>

      {byGarden.map(({ garden, plants: gPlants }) => (
        <div key={garden.id}>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            {garden.name} <span className="text-neutral-400 font-normal">({gPlants.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
      ))}

      {unassigned.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">Unassigned</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unassigned.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

