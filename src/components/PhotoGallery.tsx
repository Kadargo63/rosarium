"use client"
import { useState } from 'react'
import type { Photo, Log } from '@/types/schema'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { BLOOM_STAGES } from '@/constants'

interface Props { photos: Photo[]; logs?: Log[] }

export function PhotoGallery({ photos, logs = [] }: Props) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  if (photos.length === 0) return null

  const selected = photos[idx]!
  const matchedLog = selected.log_id ? logs.find((l) => l.id === selected.log_id) : null
  const bloomLabel = matchedLog?.bloom_stage
    ? BLOOM_STAGES.find((s) => s.value === matchedLog.bloom_stage)?.label
    : null

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx((i) => (i - 1 + photos.length) % photos.length) }
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx((i) => (i + 1) % photos.length) }

  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
        Photos <span className="font-normal text-neutral-400">({photos.length})</span>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {photos.map((photo, i) => (
          <button key={photo.id} onClick={() => { setIdx(i); setOpen(true) }}
            className="aspect-square rounded-lg overflow-hidden border hover:opacity-90 transition-opacity">
            <img src={photo.image_url} alt="Rose photo" className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-black ring-0">
          <div className="relative">
            <img src={selected.image_url} alt="Rose photo" className="w-full max-h-[75vh] object-contain" />

            {photos.length > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-14 w-full text-center text-xs text-white/50 pointer-events-none">
                  {idx + 1} / {photos.length}
                </div>
              </>
            )}

            <div className="bg-black/80 px-4 py-2.5 min-h-[2.5rem] flex flex-col gap-1">
              {matchedLog && (
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <span className="text-white/50">
                    {new Date(matchedLog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {bloomLabel && <span className="text-pink-400">{bloomLabel}</span>}
                  {matchedLog.vigor != null && <span className="text-emerald-400">V:{matchedLog.vigor}</span>}
                  {matchedLog.health != null && <span className="text-sky-400">H:{matchedLog.health}</span>}
                </div>
              )}
              {selected.notes && <p className="text-xs text-white/40 italic">{selected.notes}</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
