'use client'
import { ShareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { PlantWithDetails } from '@/types/schema'

export function ShareButton({ plant }: { plant: PlantWithDetails }) {
  const handleShare = async () => {
    const url = window.location.href
    const text = plant.rose_entity && plant.rose_entity.canonical_name !== plant.label_name
      ? plant.label_name + ' — ' + plant.rose_entity.canonical_name
      : plant.label_name

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: plant.label_name, text, url })
      } catch (err) {
        if ((err as DOMException).name !== 'AbortError') toast.error('Could not share')
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1.5 shrink-0">
      <ShareIcon className="w-3.5 h-3.5" />
      Share
    </Button>
  )
}