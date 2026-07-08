'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PlantWithDetails, Garden } from '@/types/schema'

export function EditPlantForm({ plant, gardens }: { plant: PlantWithDetails; gardens: Garden[] }) {
  const router = useRouter()
  const [label, setLabel] = useState(plant.label_name)
  const [gardenId, setGardenId] = useState(plant.garden_id ?? '')
  const [datePlanted, setDatePlanted] = useState(plant.date_planted ?? '')
  const [notes, setNotes] = useState(plant.notes ?? '')
  const [sunIndex, setSunIndex] = useState(plant.sun_index ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const save = async () => {
    if (!label.trim()) { toast.error('Label is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/plants/' + plant.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label_name: label.trim(),
          garden_id: gardenId || null,
          date_planted: datePlanted || null,
          notes: notes.trim() || null,
          sun_index: sunIndex || null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Plant updated')
      router.push('/plants/' + plant.id)
      router.refresh()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const deletePlant = async () => {
    setDeleting(true)
    try {
      const res = await fetch('/api/plants/' + plant.id, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Plant removed')
      router.push('/plants')
      router.refresh()
    } catch { toast.error('Failed to delete') } finally { setDeleting(false) }
  }

  return (
    <div className="space-y-5">
      {plant.rose_entity && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-800">
          <span className="font-medium">{plant.rose_entity.canonical_name}</span>
          {plant.rose_entity.country_of_origin && <span className="text-rose-500 ml-2">· {plant.rose_entity.country_of_origin}</span>}
          {plant.rose_entity.year_introduced && <span className="text-rose-500 ml-2">· Est. {plant.rose_entity.year_introduced}</span>}
        </div>
      )}

      <div>
        <Label>Label name</Label>
        <Input value={label} onChange={e => setLabel(e.target.value)} className="mt-1" placeholder="e.g. Voodoo Rose #2" />
      </div>

      <div>
        <Label>Garden</Label>
        <Select value={gardenId} onValueChange={v => setGardenId(v ?? '')}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="No garden assigned" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">No garden</SelectItem>
            {gardens.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Accession date <span className="text-neutral-400 font-normal">(when acquired)</span></Label>
        <input type="date" value={datePlanted} max={new Date().toISOString().split('T')[0]}
          onChange={e => setDatePlanted(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-300" />
      </div>

      <div>
        <Label>Sun exposure</Label>
        <Select value={sunIndex} onValueChange={v => setSunIndex(v ?? '')}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Not set" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Not set</SelectItem>
            <SelectItem value="EARLY_SOFT">Early / Soft — morning sun, afternoon shade</SelectItem>
            <SelectItem value="MID_BALANCED">Mid / Balanced — even sun all day</SelectItem>
            <SelectItem value="LATE_INTENSE">Late / Intense — afternoon full sun</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="mt-1" placeholder="Anything worth remembering about this plant…" />
      </div>

      <Button onClick={save} disabled={saving} className="w-full bg-rose-600 hover:bg-rose-700">
        {saving ? 'Saving…' : 'Save changes'}
      </Button>

      <div className="border-t pt-4">
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="w-full text-sm text-red-500 hover:text-red-700 py-2">
            Remove this plant from collection
          </button>
        ) : (
          <div className="space-y-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">Remove &ldquo;{plant.label_name}&rdquo;? This also deletes all its logs and photos.</p>
            <div className="flex gap-2">
              <button onClick={deletePlant} disabled={deleting}
                className="flex-1 bg-red-600 text-white text-sm py-2 rounded-lg disabled:opacity-60">
                {deleting ? 'Removing…' : 'Yes, remove'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="flex-1 border text-sm py-2 rounded-lg hover:bg-neutral-50">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}