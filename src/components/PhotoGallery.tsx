"use client"
import { useState } from 'react'
import type { Photo } from '@/types/schema'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props { photos: Photo[]; plantId?: string }

export function PhotoGallery({ photos }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Photo | null>(null)

  if (photos.length === 0) return null

  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">Photos</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {photos.map((photo) => (
          <button key={photo.id} onClick={() => { setSelected(photo); setOpen(true) }}
            className="aspect-square rounded-lg overflow-hidden border hover:opacity-90 transition-opacity">
            <img src={photo.image_url} alt="Rose photo" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-2">
          {selected && <img src={selected.image_url} alt="Rose photo" className="w-full rounded-lg" />}
          {selected?.notes && <p className="text-sm text-neutral-500 p-2">{selected.notes}</p>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
