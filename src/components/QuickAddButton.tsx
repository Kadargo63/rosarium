'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon, SearchIcon, CheckIcon, ListIcon, SearchCheckIcon } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { RoseEntity, Garden, PropagationStatus } from '@/types/schema'
import { COLOR_CODE_LABELS, GROWTH_TYPE_LABELS } from '@/constants'
import { useRosariumStore } from '@/store/useStore'

export function QuickAddButton() {
  const router = useRouter()
  const open = useRosariumStore((s) => s.quickAddOpen)
  const closeStore = useRosariumStore((s) => s.closeQuickAdd)

  const [roses, setRoses] = useState<RoseEntity[]>([])
  const [gardens, setGardens] = useState<Garden[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [gardenId, setGardenId] = useState('')
  const [accessionDate, setAccessionDate] = useState(() => new Date().toISOString().split('T')[0] as string)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<'search' | 'browse'>('browse')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/roses')
      .then((r) => r.json())
      .then(({ roses: r, gardens: g }) => {
        if (r) setRoses(r as RoseEntity[])
        if (g) {
          setGardens(g as Garden[])
          if (g.length > 0) setGardenId((g as Garden[])[0].id)
        }
      })
      .catch(() => toast.error('Could not load catalog'))
      .finally(() => setLoading(false))
    setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const close = useCallback(() => {
    closeStore()
    setQuery('')
    setSelected(new Set())
  }, [closeStore])

  const filteredRoses = query.length < 1
    ? roses
    : roses.filter(r =>
        r.canonical_name.toLowerCase().includes(query.toLowerCase()) ||
        (r.class_code ?? '').toLowerCase().includes(query.toLowerCase()) ||
        (r.breeder_code ?? '').toLowerCase().includes(query.toLowerCase())
      )

  const toggle = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const selectAll = () => setSelected(new Set(filteredRoses.map(r => r.id)))
  const clearAll = () => setSelected(new Set())

  const save = async () => {
    if (!selected.size) return
    setSaving(true)
    try {
      const supabase = getSupabase()
      const rows = Array.from(selected).map(id => {
        const rose = roses.find(r => r.id === id)!
        return {
          rose_id: id,
          garden_id: gardenId || null,
          label_name: rose.canonical_name,
          date_planted: accessionDate || null,
          propagation_status: 'none' as PropagationStatus,
          position_index: null,
          notes: null,
          sun_index: null,
          user_id: null,
        }
      })
      const { error } = await supabase.from('plants').insert(rows)
      if (error) throw error
      toast.success(`Added ${rows.length} plant${rows.length > 1 ? 's' : ''} — tap any to edit details`)
      router.refresh()
      close()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const metaLine = (r: RoseEntity) =>
    [r.class_code, r.breeder_code, r.year_introduced, r.country_of_origin].filter(Boolean).join(' · ')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="relative bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b gap-3">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder={loading ? 'Loading…' : `Filter ${roses.length} roses…`}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
          </div>
          <button onClick={close} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 flex-shrink-0">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Selection bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 border-b text-xs">
          <div className="flex items-center gap-3">
            <span className={selected.size > 0 ? 'font-semibold text-rose-700' : 'text-neutral-500'}>
              {selected.size > 0 ? `${selected.size} selected` : 'Tap rows to select'}
            </span>
            {filteredRoses.length > 0 && (
              <button onClick={selected.size === filteredRoses.length ? clearAll : selectAll}
                className="text-rose-500 hover:text-rose-700 font-medium">
                {selected.size === filteredRoses.length ? 'Deselect all' : `Select all ${filteredRoses.length}`}
              </button>
            )}
          </div>
          {selected.size > 0 && (
            <button onClick={clearAll} className="text-neutral-400 hover:text-neutral-600">Clear</button>
          )}
        </div>

        {/* Rose list */}
        <div className="flex-1 overflow-y-auto divide-y">
          {loading && (
            <div className="text-center py-10 text-sm text-neutral-400">Loading catalog…</div>
          )}
          {!loading && filteredRoses.length === 0 && (
            <div className="text-center py-10 text-sm text-neutral-400">No matches for &ldquo;{query}&rdquo;</div>
          )}
          {!loading && filteredRoses.map(rose => {
            const isSelected = selected.has(rose.id)
            return (
              <button key={rose.id} onClick={() => toggle(rose.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? 'bg-rose-50' : 'hover:bg-neutral-50'}`}>
                <span className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-600 border-rose-600' : 'border-neutral-300'}`}>
                  {isSelected && <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isSelected ? 'font-semibold text-rose-900' : 'text-neutral-800'}`}>{rose.canonical_name}</p>
                  <p className="text-xs text-neutral-400 truncate">{metaLine(rose)}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Save footer */}
        {selected.size > 0 && (
          <div className="border-t p-4 space-y-3 bg-white">
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Add {selected.size} plant{selected.size > 1 ? 's' : ''} to collection</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-neutral-500">Garden</label>
                <select value={gardenId} onChange={e => setGardenId(e.target.value)}
                  className="mt-0.5 w-full text-sm px-2.5 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                  <option value="">No garden</option>
                  {gardens.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-neutral-500">Accession date</label>
                <input type="date" value={accessionDate} max={new Date().toISOString().split('T')[0]}
                  onChange={e => setAccessionDate(e.target.value)}
                  className="mt-0.5 w-full text-sm px-2.5 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>
            <p className="text-xs text-neutral-400">Labels default to the variety name. Tap any plant afterward to edit its label, notes, or reassign garden.</p>
            <button onClick={save} disabled={saving}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <CheckIcon className="w-4 h-4" />
              {saving ? 'Saving…' : `Add ${selected.size} plant${selected.size > 1 ? 's' : ''} to collection`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}