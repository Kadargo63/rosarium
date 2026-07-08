'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon, SearchIcon, CheckIcon, ExternalLinkIcon, PlusIcon } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { RoseEntity, Garden, PropagationStatus } from '@/types/schema'
import { COLOR_CODE_LABELS } from '@/constants'
import Link from 'next/link'
import { useRosariumStore } from '@/store/useStore'

interface PendingPlant {
  rose: RoseEntity
  garden_id: string
  label_name: string
}

export function QuickAddButton() {
  const router = useRouter()
  const open = useRosariumStore((s) => s.quickAddOpen)
  const closeStore = useRosariumStore((s) => s.closeQuickAdd)
  const [roses, setRoses] = useState<RoseEntity[]>([])
  const [gardens, setGardens] = useState<Garden[]>([])
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState<PendingPlant[]>([])
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const supabase = getSupabase()
    Promise.all([
      supabase.from('rose_entities').select('*').order('canonical_name'),
      supabase.from('gardens').select('*').order('name'),
    ]).then(([{ data: r }, { data: g }]) => {
      if (r) setRoses(r as RoseEntity[])
      if (g) setGardens(g as Garden[])
    })
    setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const close = useCallback(() => {
    closeStore()
    setQuery('')
    setPending([])
  }, [closeStore])

  const filtered = query.length < 1
    ? []
    : roses.filter(r =>
        r.canonical_name.toLowerCase().includes(query.toLowerCase()) ||
        (r.breeder_code ?? '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)

  const defaultGarden = gardens[0]?.id ?? ''

  const addRose = (rose: RoseEntity) => {
    setPending(prev => [...prev, {
      rose,
      garden_id: defaultGarden,
      label_name: rose.canonical_name,
    }])
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const save = async () => {
    if (!pending.length) return
    setSaving(true)
    try {
      const supabase = getSupabase()
      const rows = pending.map(p => ({
        rose_id: p.rose.id,
        garden_id: p.garden_id || null,
        label_name: p.label_name.trim() || p.rose.canonical_name,
        propagation_status: 'none' as PropagationStatus,
        position_index: null,
        date_planted: null,
        notes: null,
        sun_index: null,
        user_id: null,
      }))
      const { error } = await supabase.from('plants').insert(rows)
      if (error) throw error
      toast.success(`Added ${pending.length} plant${pending.length > 1 ? 's' : ''}`)
      router.refresh()
      close()
    } catch {
      toast.error('Failed to save — check your connection')
    } finally {
      setSaving(false)
    }
  }

  const metaLine = (rose: RoseEntity) =>
    [
      rose.class_code,
      rose.color_code ? COLOR_CODE_LABELS[rose.color_code] : null,
      rose.breeder_code,
      rose.year_introduced,
      rose.country_of_origin,
    ].filter(Boolean).join(' · ')

  return (
    <>
      {/* Backdrop + sheet — triggered by store/BottomNav */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="relative bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b">
              <div>
                <h2 className="font-bold text-lg text-neutral-900">Add Plants</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Search catalog · select multiple · save together</p>
              </div>
              <button onClick={close} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Search input */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search by name or breeder code…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
                />
              </div>

              {/* Search results */}
              {filtered.length > 0 && (
                <div className="border rounded-xl overflow-hidden divide-y shadow-sm">
                  {filtered.map(rose => (
                    <button
                      key={rose.id}
                      onClick={() => addRose(rose)}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-rose-50 active:bg-rose-100 text-left transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{rose.canonical_name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5 truncate">{metaLine(rose)}</p>
                      </div>
                      <PlusIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {query.length >= 2 && filtered.length === 0 && (
                <p className="text-sm text-neutral-400 text-center py-2">
                  No matches — <Link href="/plants/add" onClick={close} className="text-rose-500 underline">add manually</Link>
                </p>
              )}

              {/* Pending queue */}
              {pending.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    {pending.length} plant{pending.length > 1 ? 's' : ''} queued
                  </p>
                  {pending.map((p, i) => (
                    <div key={i} className="border rounded-xl p-3 bg-rose-50/40 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-800 truncate">{p.rose.canonical_name}</p>
                          <p className="text-xs text-neutral-500 truncate">{metaLine(p.rose)}</p>
                        </div>
                        <button
                          onClick={() => setPending(prev => prev.filter((_, j) => j !== i))}
                          className="p-1 rounded hover:bg-neutral-200 flex-shrink-0"
                        >
                          <XIcon className="w-3.5 h-3.5 text-neutral-400" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={p.label_name}
                          onChange={e => setPending(prev => prev.map((x, j) => j === i ? { ...x, label_name: e.target.value } : x))}
                          placeholder="Label name…"
                          className="flex-1 text-xs px-2.5 py-1.5 border rounded-lg outline-none focus:ring-1 focus:ring-rose-300 bg-white"
                        />
                        <select
                          value={p.garden_id}
                          onChange={e => setPending(prev => prev.map((x, j) => j === i ? { ...x, garden_id: e.target.value } : x))}
                          className="text-xs px-2 py-1.5 border rounded-lg outline-none focus:ring-1 focus:ring-rose-300 bg-white"
                        >
                          <option value="">No garden</option>
                          {gardens.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state hint */}
              {pending.length === 0 && query.length < 1 && (
                <div className="text-center py-6 text-neutral-400">
                  <p className="text-sm">Search the catalog above to start adding plants.</p>
                  <Link href="/plants/add" onClick={close} className="inline-flex items-center gap-1 mt-2 text-xs text-rose-400 hover:text-rose-600">
                    <ExternalLinkIcon className="w-3 h-3" /> Add an unlisted variety manually
                  </Link>
                </div>
              )}
            </div>

            {/* Sticky footer */}
            {pending.length > 0 && (
              <div className="border-t px-4 py-3 bg-white rounded-b-2xl">
                <button
                  onClick={save}
                  disabled={saving}
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    'Saving…'
                  ) : (
                    <><CheckIcon className="w-4 h-4" /> Save {pending.length} plant{pending.length > 1 ? 's' : ''}</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}