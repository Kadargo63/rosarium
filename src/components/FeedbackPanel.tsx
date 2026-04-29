"use client"
import type { Feedback } from '@/types/schema'
import { FEEDBACK_TAGS } from '@/constants'
import { Badge } from './ui/badge'
import { ShareIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Props { feedback: Feedback[]; plantId: string }

export function FeedbackPanel({ feedback, plantId }: Props) {
  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}/feedback/${plantId}`
    : `/feedback/${plantId}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast.success('Feedback link copied!')
  }

  const tagCounts: Record<string, number> = {}
  feedback.forEach((f) => f.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] ?? 0) + 1 }))

  const avgRating = feedback.filter((f) => f.rating).length
    ? (feedback.filter((f) => f.rating).reduce((s, f) => s + (f.rating ?? 0), 0) / feedback.filter((f) => f.rating).length).toFixed(1)
    : null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">External Observations</h2>
        <button onClick={copyLink}
          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700">
          <ShareIcon className="w-3.5 h-3.5" /> Request Feedback
        </button>
      </div>

      {feedback.length === 0 && (
        <p className="text-sm text-neutral-400 italic">No external feedback yet. Share the link with your garden club.</p>
      )}

      {feedback.length > 0 && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="bg-white border rounded-lg p-3">
            <div className="flex items-center gap-3 text-sm">
              <span><span className="font-semibold">{feedback.length}</span> <span className="text-neutral-500">observations</span></span>
              {avgRating && <span><span className="font-semibold">{avgRating}/5</span> <span className="text-neutral-500">avg rating</span></span>}
            </div>
            {Object.keys(tagCounts).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {FEEDBACK_TAGS.find((t) => t.value === tag)?.label ?? tag} ({count})
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Individual entries */}
          {feedback.slice(0, 5).map((f) => (
            <div key={f.id} className="bg-white border rounded-lg p-3 text-sm">
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>{f.author_name ?? 'Anonymous'}</span>
                <span>{new Date(f.created_at).toLocaleDateString()}</span>
              </div>
              {f.rating && <div className="text-yellow-500">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>}
              {f.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {f.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              )}
              {f.comment && <p className="text-neutral-600 mt-1 text-xs">{f.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
