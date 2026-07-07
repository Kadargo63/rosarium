'use client'
import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { SmartphoneIcon } from 'lucide-react'

export function PhoneQR() {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    setUrl(window.location.origin + '/propagation')
  }, [])

  if (!url) return null

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200">
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        <SmartphoneIcon className="w-4 h-4 text-rose-500" />
        Open on Phone
      </div>
      <QRCodeSVG
        value={url}
        size={160}
        bgColor="#ffffff"
        fgColor="#881337"
        level="M"
      />
      <p className="text-xs text-neutral-400 text-center break-all max-w-[180px]">{url}</p>
    </div>
  )
}