'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLog, uploadPhoto, createPhoto } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { PhotoUploader } from '@/components/PhotoUploader'
import { BLOOM_STAGES } from '@/constants'
import { toast } from 'sonner'
import type { BloomStage } from '@/types/schema'

export function LogForm({ plantId }: { plantId: string }) {
  const router = useRouter()
  const [vigor, setVigor] = useState(3)
  const [health, setHealth] = useState(3)
  const [stemQuality, setStemQuality] = useState(3)
  const [bloomStage, setBloomStage] = useState('')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const log = await createLog({
        plant_id: plantId,
        date: new Date().toISOString().split('T')[0] as string,
        vigor,
        health,
        stem_quality: stemQuality,
        bloom_stage: (bloomStage as BloomStage) || null,
        notes: notes.trim() || null,
      })
      for (const file of photos) {
        const url = await uploadPhoto(plantId, file)
        await createPhoto({
          plant_id: plantId,
          log_id: (log as { id: string }).id,
          image_url: url,
          taken_at: new Date().toISOString(),
          notes: null,
        })
      }
      toast.success('Log saved!')
      router.push('/plants/' + plantId)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save log')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label>Vigor <span className="text-rose-500 font-bold ml-1">{vigor}/5</span></Label>
        <Slider min={1} max={5} step={1} value={[vigor]} onValueChange={(v) => setVigor(Array.isArray(v) ? (v[0] ?? 3) : (v as number))} className="mt-2" />
      </div>
      <div>
        <Label>Health <span className="text-rose-500 font-bold ml-1">{health}/5</span></Label>
        <Slider min={1} max={5} step={1} value={[health]} onValueChange={(v) => setHealth(Array.isArray(v) ? (v[0] ?? 3) : (v as number))} className="mt-2" />
      </div>
      <div>
        <Label>Stem Quality <span className="text-rose-500 font-bold ml-1">{stemQuality}/5</span></Label>
        <Slider min={1} max={5} step={1} value={[stemQuality]} onValueChange={(v) => setStemQuality(Array.isArray(v) ? (v[0] ?? 3) : (v as number))} className="mt-2" />
      </div>
      <div>
        <Label>Bloom Stage</Label>
        <Select value={bloomStage} onValueChange={(v) => setBloomStage(v ?? '')}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select bloom stage..." />
          </SelectTrigger>
          <SelectContent>
            {BLOOM_STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea
          placeholder="Observations, treatments, weather conditions..."
          className="mt-1"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
      </div>
      <PhotoUploader onPhotosChange={setPhotos} />
      <Button type="submit" disabled={submitting} className="w-full bg-rose-600 hover:bg-rose-700">
        {submitting ? 'Saving...' : 'Save Log'}
      </Button>
    </form>
  )
}