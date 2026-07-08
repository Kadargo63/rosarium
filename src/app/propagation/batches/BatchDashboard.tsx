'use client'
import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CheckCircle2Icon, XCircleIcon, SproutIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface Batch {
  id: string
  batch_code: string
  date_taken: string
  initial_count: number
  notes: string | null
  status: string
  parent_plant: { label_name: string; rose_entity: { canonical_name: string } | null } | null
  propagation_batch_updates: Array<{
    id: string; update_date: string; viable_count: number | null
    failed_count: number | null; rooted_count: number | null; notes: string | null
  }>
}

export function BatchDashboard({ initialBatches }: { initialBatches: Batch[] }) {
  const [batches, setBatches] = useState(initialBatches)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [form, setForm] = useState({ viable: '', failed: '', rooted: '', notes: '' })

  const openUpdate = (b: Batch) => {
    const last = b.propagation_batch_updates[0]
    setForm({
      viable: String(last?.viable_count ?? b.initial_count),
      failed: String(last?.failed_count ?? 0),
      rooted: String(last?.rooted_count ?? 0),
      notes: '',
    })
    setExpandedId(expandedId === b.id ? null : b.id)
  }

  const saveUpdate = async (batchId: string) => {
    setUpdatingId(batchId)
    try {
      const today = new Date().toISOString().split('T')[0]
      const supabase = getSupabase()
      await supabase.from('propagation_batch_updates').insert({
        batch_id: batchId,
        update_date: today,
        viable_count: form.viable ? parseInt(form.viable) : null,
        failed_count: form.failed ? parseInt(form.failed) : null,
        rooted_count: form.rooted ? parseInt(form.rooted) : null,
        notes: form.notes.trim() || null,
      })
      setBatches(prev => prev.map(b => b.id !== batchId ? b : {
        ...b,
        propagation_batch_updates: [
          { id: crypto.randomUUID(), update_date: today, viable_count: form.viable ? parseInt(form.viable) : null,
            failed_count: form.failed ? parseInt(form.failed) : null, rooted_count: form.rooted ? parseInt(form.rooted) : null,
            notes: form.notes.trim() || null },
          ...b.propagation_batch_updates,
        ],
      }))
      setExpandedId(null)
      toast.success('Batch updated')
    } catch { toast.error('Failed to update') } finally { setUpdatingId(null) }
  }

  const markComplete = async (batchId: string) => {
    try {
      await getSupabase().from('propagation_batches').update({ status: 'complete' }).eq('id', batchId)
      setBatches(prev => prev.filter(b => b.id !== batchId))
      toast.success('Batch marked complete')
    } catch { toast.error('Failed') }
  }

  if (!batches.length) return (
    <div className="text-center py-10 text-neutral-400">
      <p className="text-sm">No active batches.</p>
      <p className="text-xs mt-1">Start one from the Propagation tracker by tapping ✂ on a plant.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {batches.map(b => {
        const last = b.propagation_batch_updates[0]
        const daysSince = Math.floor((Date.now() - new Date(b.date_taken).getTime()) / 86400000)
        const isExpanded = expandedId === b.id
        return (
          <div key={b.id} className="bg-white border rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-700 text-sm bg-rose-50 px-2 py-0.5 rounded">{b.batch_code}</span>
                    <span className="text-xs text-neutral-400">{daysSince}d ago</span>
                  </div>
                  <p className="text-sm font-medium text-neutral-800 mt-1">
                    {b.parent_plant?.rose_entity?.canonical_name ?? b.parent_plant?.label_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-neutral-400">{b.parent_plant?.label_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-neutral-500">Started with</p>
                  <p className="text-lg font-bold text-neutral-800">{b.initial_count}</p>
                  <p className="text-xs text-neutral-400">cuttings</p>
                </div>
              </div>

              {last && (
                <div className="flex gap-4 mt-3 text-xs">
                  <span className="text-emerald-600 font-medium">{last.viable_count ?? '?'} viable</span>
                  <span className="text-red-400">{last.failed_count ?? 0} failed</span>
                  <span className="text-green-700 font-bold">{last.rooted_count ?? 0} rooted ✓</span>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button onClick={() => openUpdate(b)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs py-2 border border-rose-300 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                  {isExpanded ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
                  Update counts
                </button>
                <button onClick={() => markComplete(b.id)}
                  className="flex items-center gap-1 text-xs py-2 px-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                  <CheckCircle2Icon className="w-3.5 h-3.5" /> Done
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t bg-neutral-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Update counts — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[['viable', 'Viable', 'text-emerald-700'], ['failed', 'Failed', 'text-red-500'], ['rooted', 'Rooted', 'text-green-700']].map(([key, label, color]) => (
                    <div key={key}>
                      <label className={'text-xs font-medium ' + color}>{label}</label>
                      <input type="number" min="0" value={form[key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="mt-1 w-full text-center px-2 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-300" />
                    </div>
                  ))}
                </div>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Notes (e.g. 2 cuttings wilting, moved to shadier spot)…"
                  className="w-full text-xs px-3 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-rose-300 resize-none" rows={2} />
                <button onClick={() => saveUpdate(b.id)} disabled={updatingId === b.id}
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl">
                  {updatingId === b.id ? 'Saving…' : 'Save update'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}