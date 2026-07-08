'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XIcon, MapPinIcon } from 'lucide-react'
import type { SunIndex } from '@/types/schema'

const SUN_OPTIONS: { value: SunIndex; label: string; description: string }[] = [
  { value: 'EARLY_SOFT', label: 'Early / Soft', description: 'Morning sun, afternoon shade' },
  { value: 'MID_BALANCED', label: 'Mid / Balanced', description: 'Even sun throughout the day' },
  { value: 'LATE_INTENSE', label: 'Late / Intense', description: 'Afternoon full sun' },
]

interface Garden { id: string; name: string; description: string | null; location_notes: string | null; sun_index: SunIndex | null; plant_count: number }
interface GardenFormData { name: string; description: string; location_notes: string; sun_index: SunIndex | '' }

const emptyForm = (): GardenFormData => ({ name: '', description: '', location_notes: '', sun_index: '' })

// Defined OUTSIDE GardenManager to prevent remount on every keystroke
function GardenFormFields({ isNew, form, saving, onChange, onSave, onCancel }: {
  isNew: boolean; form: GardenFormData; saving: boolean
  onChange: (k: keyof GardenFormData, v: string) => void
  onSave: () => void; onCancel: () => void
}) {
  return (
    <div className="space-y-3 border rounded-xl p-4 bg-neutral-50">
      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">{isNew ? 'New Garden Location' : 'Edit Garden'}</p>
      <div>
        <label className="text-xs text-neutral-500">Name *</label>
        <input value={form.name} onChange={e => onChange('name', e.target.value)}
          placeholder="e.g. East Fence, Back Patio, South Bed"
          className="mt-1 w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-300 bg-white" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Description</label>
        <input value={form.description} onChange={e => onChange('description', e.target.value)}
          placeholder="e.g. Scent garden along east fence"
          className="mt-1 w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-300 bg-white" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Location notes</label>
        <input value={form.location_notes} onChange={e => onChange('location_notes', e.target.value)}
          placeholder="e.g. Right=morning light, full sun by noon"
          className="mt-1 w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-300 bg-white" />
      </div>
      <div>
        <label className="text-xs text-neutral-500">Sun exposure</label>
        <div className="mt-1 grid grid-cols-1 gap-1.5">
          {SUN_OPTIONS.map(s => (
            <button key={s.value} type="button" onClick={() => onChange('sun_index', form.sun_index === s.value ? '' : s.value)}
              className={'flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-colors ' +
                (form.sun_index === s.value ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-neutral-200 bg-white hover:border-neutral-300')}>
              <span className="text-base">{s.value === 'EARLY_SOFT' ? '🌤' : s.value === 'MID_BALANCED' ? '☀️' : '🌞'}</span>
              <div>
                <span className="font-medium text-xs">{s.label}</span>
                <span className="text-neutral-400 text-xs ml-2">{s.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={saving}
          className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5">
          <CheckIcon className="w-4 h-4" /> {saving ? 'Saving…' : isNew ? 'Add Location' : 'Save Changes'}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 border rounded-xl text-sm text-neutral-600 hover:bg-neutral-100">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function GardenManager({ initialGardens }: { initialGardens: Garden[] }) {
  const router = useRouter()
  const [gardens, setGardens] = useState(initialGardens)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<GardenFormData>(emptyForm())
  const [saving, setSaving] = useState(false)

  const onChange = (k: keyof GardenFormData, v: string) => setForm(f => ({ ...f, [k]: v }))
  const cancel = () => { setShowAdd(false); setEditId(null); setForm(emptyForm()) }

  const openEdit = (g: Garden) => {
    setEditId(g.id)
    setShowAdd(false)
    setForm({ name: g.name, description: g.description ?? '', location_notes: g.location_notes ?? '', sun_index: g.sun_index ?? '' })
  }

  const save = async (isNew: boolean) => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() || null, location_notes: form.location_notes.trim() || null, sun_index: form.sun_index || null, user_id: null }
      const supabase = getSupabase()
      if (isNew) {
        const { data, error } = await supabase.from('gardens').insert(payload).select().single()
        if (error) throw error
        setGardens(prev => [...prev, { ...(data as Garden), plant_count: 0 }].sort((a, b) => a.name.localeCompare(b.name)))
        setShowAdd(false)
        toast.success('Garden added')
      } else {
        const { error } = await supabase.from('gardens').update(payload).eq('id', editId!)
        if (error) throw error
        setGardens(prev => prev.map(g => g.id === editId ? { ...g, ...payload, sun_index: payload.sun_index as SunIndex | null } : g).sort((a, b) => a.name.localeCompare(b.name)))
        setEditId(null)
        toast.success('Garden updated')
      }
      setForm(emptyForm())
      router.refresh()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const confirmDelete = async (id: string) => {
    setSaving(true)
    try {
      const supabase = getSupabase()
      await supabase.from('plants').update({ garden_id: null }).eq('garden_id', id)
      await supabase.from('gardens').delete().eq('id', id)
      setGardens(prev => prev.filter(g => g.id !== id))
      setDeleteId(null)
      toast.success('Garden removed — plants moved to Unassigned')
      router.refresh()
    } catch { toast.error('Failed to delete') } finally { setSaving(false) }
  }

  return (
    <div className="space-y-3">
      {!showAdd && !editId && (
        <button onClick={() => { setShowAdd(true); setForm(emptyForm()) }}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-rose-200 text-rose-500 hover:border-rose-400 hover:bg-rose-50 rounded-xl py-3 text-sm font-medium transition-colors">
          <PlusIcon className="w-4 h-4" /> Add Garden Location
        </button>
      )}

      {showAdd && (
        <GardenFormFields isNew form={form} saving={saving} onChange={onChange} onSave={() => save(true)} onCancel={cancel} />
      )}

      {gardens.map(g => (
        <div key={g.id}>
          {editId === g.id ? (
            <GardenFormFields isNew={false} form={form} saving={saving} onChange={onChange} onSave={() => save(false)} onCancel={cancel} />
          ) : (
            <div className="bg-white border rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <MapPinIcon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-neutral-800">{g.name}</p>
                    {g.description && <p className="text-xs text-neutral-500 mt-0.5">{g.description}</p>}
                    {g.location_notes && <p className="text-xs text-neutral-400 mt-0.5 italic">{g.location_notes}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-neutral-400">{g.plant_count} plant{g.plant_count !== 1 ? 's' : ''}</span>
                      {g.sun_index && <span className="text-xs text-neutral-400">· {SUN_OPTIONS.find(s => s.value === g.sun_index)?.label ?? g.sun_index}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors">
                    <PencilIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(g.id === deleteId ? null : g.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {deleteId === g.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <p className="text-xs text-red-700 font-medium">
                    Delete &ldquo;{g.name}&rdquo;?
                    {g.plant_count > 0 &&   plant will move to Unassigned.}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => confirmDelete(g.id)} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-medium py-2 rounded-lg">
                      {saving ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button onClick={() => setDeleteId(null)} className="flex-1 border text-xs text-neutral-600 py-2 rounded-lg hover:bg-neutral-50">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}