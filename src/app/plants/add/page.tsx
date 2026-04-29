"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPlant, getGardens } from '@/lib/queries'
import { resolveRose } from '@/lib/resolveRose'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useEffect } from 'react'
import type { Garden } from '@/types/schema'
import type { ResolveResult } from '@/lib/resolveRose'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  label_name: z.string().min(2),
  rose_id: z.string().optional(),
  garden_id: z.string().optional(),
  date_planted: z.string().optional(),
  notes: z.string().optional(),
  sun_index: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function AddPlantPage() {
  const router = useRouter()
  const [gardens, setGardens] = useState<Garden[]>([])
  const [resolveResults, setResolveResults] = useState<ResolveResult[]>([])
  const [selectedRose, setSelectedRose] = useState<ResolveResult | null>(null)
  const [resolving, setResolving] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    getGardens().then(setGardens)
  }, [])

  const labelName = watch('label_name')

  useEffect(() => {
    if (!labelName || labelName.length < 3) { setResolveResults([]); return }
    const timeout = setTimeout(async () => {
      setResolving(true)
      const results = await resolveRose(labelName)
      setResolveResults(results)
      setResolving(false)
    }, 400)
    return () => clearTimeout(timeout)
  }, [labelName])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const plant = await createPlant({
        label_name: data.label_name,
        rose_id: selectedRose?.entity.id ?? data.rose_id ?? null,
        garden_id: data.garden_id ?? null,
        date_planted: data.date_planted ?? null,
        notes: data.notes ?? null,
        sun_index: (data.sun_index as 'EARLY_SOFT' | 'MID_BALANCED' | 'LATE_INTENSE') ?? null,
        user_id: null,
        position_index: null,
      })
      toast.success('Plant added!')
      router.push(`/plants/${plant.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add plant')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/plants"><ArrowLeftIcon className="w-4 h-4 text-neutral-400" /></Link>
        <h1 className="text-xl font-bold text-rose-900">Add Plant</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="label_name">Plant Label Name *</Label>
          <Input id="label_name" placeholder="e.g. Mister Lincoln Rose" className="mt-1" {...register('label_name')} />
          {resolving && <p className="text-xs text-neutral-400 mt-1">Searching rose catalog...</p>}
          {resolveResults.length > 0 && !selectedRose && (
            <div className="mt-2 border rounded-md divide-y">
              {resolveResults.map((r) => (
                <button key={r.entity.id} type="button" onClick={() => { setSelectedRose(r); setValue('rose_id', r.entity.id) }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 text-sm">
                  <span className="font-medium">{r.entity.canonical_name}</span>
                  {r.matched_alias && <span className="text-neutral-400 ml-1">(aka {r.matched_alias})</span>}
                  <span className="ml-2 text-xs text-neutral-400">{r.entity.class_code} · {r.entity.color_code} · {r.entity.breeder_code}</span>
                  <span className="ml-2 text-xs text-rose-400">{Math.round(r.confidence * 100)}% match</span>
                </button>
              ))}
            </div>
          )}
          {selectedRose && (
            <div className="mt-2 flex items-center gap-2 bg-rose-50 rounded px-3 py-2 text-sm">
              <span className="font-medium text-rose-800">{selectedRose.entity.canonical_name}</span>
              <Badge variant="outline" className="text-xs">{selectedRose.entity.class_code}</Badge>
              <button type="button" onClick={() => { setSelectedRose(null); setValue('rose_id', undefined) }}
                className="ml-auto text-xs text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
          )}
        </div>

        <div>
          <Label>Garden</Label>
          <Select onValueChange={(v: string | null) => setValue('garden_id', v ?? undefined)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select garden..." /></SelectTrigger>
            <SelectContent>
              {gardens.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sun Exposure</Label>
          <Select onValueChange={(v: string | null) => setValue('sun_index', v ?? undefined)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select exposure..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EARLY_SOFT">Early / Soft Light</SelectItem>
              <SelectItem value="MID_BALANCED">Mid / Balanced</SelectItem>
              <SelectItem value="LATE_INTENSE">Late / Intense Sun</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date_planted">Date Planted</Label>
          <input type="date" id="date_planted" className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2 text-sm" {...register('date_planted')} />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="Location, purchase source, anything notable..." className="mt-1" {...register('notes')} />
        </div>

        <Button type="submit" disabled={submitting} className="w-full bg-rose-600 hover:bg-rose-700">
          {submitting ? 'Adding...' : 'Add Plant'}
        </Button>
      </form>
    </div>
  )
}
