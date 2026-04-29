"use client"
import { useRef, useState } from 'react'
import { Label } from './ui/label'
import { CameraIcon, XIcon } from 'lucide-react'

interface Props { onPhotosChange: (files: File[]) => void }

export function PhotoUploader({ onPhotosChange }: Props) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024)
    const newPreviews = valid.map((file) => ({ file, url: URL.createObjectURL(file) }))
    const all = [...previews, ...newPreviews].slice(0, 5)
    setPreviews(all)
    onPhotosChange(all.map((p) => p.file))
  }

  const remove = (idx: number) => {
    const updated = previews.filter((_, i) => i !== idx)
    setPreviews(updated)
    onPhotosChange(updated.map((p) => p.file))
  }

  return (
    <div>
      <Label>Photos (up to 5, max 5MB each)</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {previews.map((p, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
            <img src={p.url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5">
              <XIcon className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        {previews.length < 5 && (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:border-rose-400 hover:text-rose-400 transition-colors">
            <CameraIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
    </div>
  )
}
