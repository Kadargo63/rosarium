'use client'
import { useState } from 'react'
import { Scissors, CheckCircle2, Circle, Loader2, ClipboardListIcon } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'
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

export function PropagationChecklist({
  initialPlants,
  autoOpenPlantId = null,
}: {
  initialPlants: PropagationPlant[]
  autoOpenPlantId?: string | null
}) {
  const [plants, setPlants] = useState(initialPlants)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const [activeCuttingId, setActiveCuttingId] = useState<string | null>(autoOpenPlantId)
  const [showOrphanForm, setShowOrphanForm] = useState(false)
  const [orphanLabel, setOrphanLabel] = useState('')
  const [batchCode, setBatchCode] = useState('')
  const [cutCount, setCutCount] = useState(1)
  const [cutNotes, setCutNotes] = useState('')
  const [savingBatch, setSavingBatch] = useState(false)

  const genCode = (canonicalName: string) => {
    const letters = canonicalName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3)
    const d = new Date()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${letters}-${mm}${dd}`
  }

  const openCuttingForm = (plant: PropagationPlant) => {
    setActiveCuttingId(plant.id === activeCuttingId ? null : plant.id)
    setBatchCode(genCode(plant.canonical_name))
    setCutCount(1)
    setCutNotes('')
  }

  const saveBatch = async (plant: PropagationPlant) => {
    if (!batchCode.trim()) return
    setSavingBatch(true)
    try {
      const supabase = getSupabase()
      await supabase.from('propagation_batches').insert({
        parent_plant_id: plant.id,
        batch_code: batchCode.trim(),
        date_taken: new Date().toISOString().split('T')[0],
        initial_count: cutCount,
        notes: cutNotes.trim() || null,
        status: 'active',
      })
      if (plant.propagation_status === 'none') {
        await fetch('/api/propagation/' + plant.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cutting_taken' }),
        })
        setPlants((prev) => prev.map((p) => p.id === plant.id ? { ...p, propagation_status: 'cutting_taken' } : p))
      }
      setActiveCuttingId(null)
      toast.success(`Batch ${batchCode} — ${cutCount} cutting${cutCount > 1 ? 's' : ''} recorded`)
    } catch {
      toast.error('Failed to save batch')
    } finally {
      setSavingBatch(false)
    }
  }

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
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-xs flex-wrap">
            <span className="text-green-700 font-medium">{propagated} done</span>
            <span className="text-amber-700 font-medium">{inProgress} in progress</span>
            <span className="text-neutral-400">{notStarted} not started</span>
          </div>
          <Link href="/propagation/batches" className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1">
            <ClipboardListIcon className="w-3.5 h-3.5" /> Batches
          </Link>
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
                isCuttingOpen={activeCuttingId === plant.id}
                onCuttingToggle={openCuttingForm}
                batchCode={batchCode}
                cutCount={cutCount}
                cutNotes={cutNotes}
                savingBatch={savingBatch}
                onBatchCodeChange={setBatchCode}
                onCutCountChange={setCutCount}
                onCutNotesChange={setCutNotes}
                onSaveBatch={saveBatch}
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
                isCuttingOpen={activeCuttingId === plant.id}
                onCuttingToggle={openCuttingForm}
                batchCode={batchCode}
                cutCount={cutCount}
                cutNotes={cutNotes}
                savingBatch={savingBatch}
                onBatchCodeChange={setBatchCode}
                onCutCountChange={setCutCount}
                onCutNotesChange={setCutNotes}
                onSaveBatch={saveBatch}
              />
            ))}
          </div>
        </section>
      )}

      {/* Orphan batch — unlisted / wild cutting */}
      <section className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-400">Unlisted / Wild Cuttings</h2>
          <button onClick={() => setShowOrphanForm(f => !f)}
            className="text-xs text-amber-600 hover:text-amber-800 font-medium">
            {showOrphanForm ? 'Cancel' : '+ Record cutting'}
          </button>
        </div>
        {showOrphanForm && (
          <div className="border rounded-xl p-3 bg-amber-50/60 space-y-2">
            <p className="text-xs text-neutral-500">For cuttings taken from plants not in your inventory (wild roses, neighbours&apos; gardens, etc.)</p>
            <input type="text" value={orphanLabel} onChange={e => setOrphanLabel(e.target.value)}
              placeholder="Label / description (e.g. Wild pink climber from back fence)"
              className="w-full px-2.5 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-amber-400 bg-white" />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-neutral-500">Batch code</label>
                <input type="text" value={batchCode} onChange={e => setBatchCode(e.target.value)}
                  placeholder="e.g. WLD-0708"
                  className="mt-0.5 w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-amber-400 bg-white" />
              </div>
              <div className="w-20">
                <label className="text-xs text-neutral-500">Count</label>
                <input type="number" min="1" value={cutCount} onChange={e => setCutCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-0.5 w-full text-center px-2 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-amber-400 bg-white" />
              </div>
            </div>
            <button
              onClick={async () => {
                if (!orphanLabel.trim() || !batchCode.trim()) return
                setSavingBatch(true)
                try {
                  const supabase = getSupabase()
                  await supabase.from('propagation_batches').insert({
                    parent_plant_id: null,
                    batch_label: orphanLabel.trim(),
                    batch_code: batchCode.trim(),
                    date_taken: new Date().toISOString().split('T')[0],
                    initial_count: cutCount,
                    notes: cutNotes.trim() || null,
                    status: 'active',
                  })
                  setShowOrphanForm(false)
                  setOrphanLabel('')
                  setBatchCode('')
                  setCutCount(1)
                  toast.success(`Batch ${batchCode} recorded`)
                } catch { toast.error('Failed to save') } finally { setSavingBatch(false) }
              }}
              disabled={savingBatch || !orphanLabel.trim() || !batchCode.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-semibold py-2.5 rounded-lg">
              {savingBatch ? 'Saving…' : `Record ${cutCount} cutting${cutCount > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function PlantRow({
  plant, isUpdating, onToggle, isCritical = false,
  isCuttingOpen, onCuttingToggle, batchCode, cutCount, cutNotes,
  savingBatch, onBatchCodeChange, onCutCountChange, onCutNotesChange, onSaveBatch,
}: {
  plant: PropagationPlant
  isUpdating: boolean
  onToggle: (id: string) => void
  isCritical?: boolean
  isCuttingOpen: boolean
  onCuttingToggle: (plant: PropagationPlant) => void
  batchCode: string
  cutCount: number
  cutNotes: string
  savingBatch: boolean
  onBatchCodeChange: (v: string) => void
  onCutCountChange: (v: number) => void
  onCutNotesChange: (v: string) => void
  onSaveBatch: (plant: PropagationPlant) => void
}) {
  const config = STATUS_CONFIG[plant.propagation_status]
  const Icon = isUpdating ? Loader2 : config.icon
  const done = plant.propagation_status === 'propagated'

  return (
    <div className={[
      'rounded-xl border bg-white overflow-hidden',
      isCritical && !done ? 'border-red-200' : 'border-neutral-200',
    ].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-3 p-3.5">
        <button
          onClick={() => onToggle(plant.id)}
          disabled={isUpdating}
          className="flex items-center gap-3 flex-1 min-w-0 text-left active:scale-[0.98] transition-transform select-none"
        >
          <span className={'flex-shrink-0 p-1.5 rounded-lg ' + config.colorClass}>
            <Icon className={'w-4 h-4' + (isUpdating ? ' animate-spin' : '')} />
          </span>
          <div className="flex-1 min-w-0">
            <p className={'text-sm font-medium truncate ' + (done ? 'line-through text-neutral-400' : 'text-neutral-800')}>
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
        <button
          onClick={() => onCuttingToggle(plant)}
          title="Log cuttings batch"
          className={'flex-shrink-0 p-2 rounded-lg transition-colors ' + (isCuttingOpen ? 'bg-amber-100 text-amber-700' : 'text-neutral-300 hover:text-amber-600 hover:bg-amber-50')}
        >
          <Scissors className="w-4 h-4" />
        </button>
      </div>

      {isCuttingOpen && (
        <div className="border-t bg-amber-50/60 p-3 space-y-2">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Log cutting batch</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-neutral-500">Batch code</label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => onBatchCodeChange(e.target.value)}
                placeholder="e.g. VOO-0708"
                className="mt-0.5 w-full px-2.5 py-1.5 border rounded-lg text-sm font-mono outline-none focus:ring-1 focus:ring-amber-400 bg-white"
              />
            </div>
            <div className="w-20">
              <label className="text-xs text-neutral-500">Count</label>
              <input
                type="number"
                min="1"
                value={cutCount}
                onChange={(e) => onCutCountChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-0.5 w-full text-center px-2 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-amber-400 bg-white"
              />
            </div>
          </div>
          <input
            type="text"
            value={cutNotes}
            onChange={(e) => onCutNotesChange(e.target.value)}
            placeholder="Notes (optional)…"
            className="w-full px-2.5 py-1.5 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-amber-400 bg-white"
          />
          <button
            onClick={() => onSaveBatch(plant)}
            disabled={savingBatch || !batchCode.trim()}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
          >
            {savingBatch ? 'Saving…' : `Record batch — ${cutCount} cutting${cutCount > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}