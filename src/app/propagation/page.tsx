export const dynamic = 'force-dynamic'

import { PropagationChecklist } from '@/components/PropagationChecklist'
import { supabase } from '@/lib/supabase'
import type { PropagationStatus } from '@/types/schema'

interface RawPlant {
  id: string
  rose_id: string | null
  label_name: string
  propagation_status: string | null
  propagation_notes: string | null
  rose_entity: { canonical_name: string } | null
  garden: { name: string } | null
}

async function getPropagationData() {
  const { data, error } = await supabase
    .from('plants')
    .select('id, rose_id, label_name, propagation_status, propagation_notes, rose_entity:rose_entities(canonical_name), garden:gardens(name)')
    .order('label_name', { ascending: true })
  if (error) throw error

  const plants = data as unknown as RawPlant[]

  const varietyCounts: Record<string, number> = {}
  for (const p of plants) {
    if (p.rose_id) varietyCounts[p.rose_id] = (varietyCounts[p.rose_id] ?? 0) + 1
  }

  return plants.map((p) => ({
    id: p.id,
    label_name: p.label_name,
    canonical_name: p.rose_entity?.canonical_name ?? p.label_name,
    garden_name: p.garden?.name ?? null,
    propagation_status: (p.propagation_status ?? 'none') as PropagationStatus,
    variety_count: p.rose_id ? (varietyCounts[p.rose_id] ?? 1) : 1,
  }))
}

export default async function PropagationPage({
  searchParams,
}: {
  searchParams: { plantId?: string }
}) {
  const plants = await getPropagationData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-rose-900">Propagation Tracker</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Tap a plant to cycle its status. Critical plants have no backup — clone these first.
        </p>
      </div>
      <PropagationChecklist initialPlants={plants} autoOpenPlantId={searchParams.plantId ?? null} />
    </div>
  )
}