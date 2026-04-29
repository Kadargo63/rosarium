"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FEEDBACK_TAGS } from '@/constants'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Slider } from './ui/slider'

const schema = z.object({
  author_name: z.string().optional(),
  comment: z.string().max(500).optional(),
  honeypot: z.string().max(0).optional(),
})

type FormData = z.infer<typeof schema>

export function FeedbackForm({ plantId }: { plantId: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(3)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })

  const toggleTag = (t: string) => setSelectedTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: plantId, author_name: data.author_name, rating, tags: selectedTags, comment: data.comment, honeypot: data.honeypot }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Could not submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🌹</div>
        <h2 className="font-semibold text-neutral-800">Thank you!</h2>
        <p className="text-sm text-neutral-500 mt-1">Your observations help improve care for this plant.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot - hidden from users */}
      <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <Label>Your Name (optional)</Label>
        <Input placeholder="First name or initials" className="mt-1" {...register('author_name')} />
      </div>

      <div>
        <Label>Overall Rating <span className="text-rose-500 font-bold ml-1">{rating}/5</span></Label>
        <Slider min={1} max={5} step={1} value={[rating]} onValueChange={(vals) => setRating(Array.isArray(vals) ? (vals[0] ?? rating) : (vals as number))} className="mt-2" />
      </div>

      <div>
        <Label>What did you observe? (select all that apply)</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {FEEDBACK_TAGS.map((t) => (
            <button key={t.value} type="button" onClick={() => toggleTag(t.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTags.includes(t.value) ? 'bg-rose-500 text-white border-rose-500' : 'border-neutral-300 text-neutral-600 hover:border-rose-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Comment (optional)</Label>
        <Textarea placeholder="Share what you noticed about this rose..." className="mt-1" maxLength={500} {...register('comment')} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full bg-rose-600 hover:bg-rose-700">
        {submitting ? 'Submitting...' : 'Submit Observation'}
      </Button>
    </form>
  )
}
