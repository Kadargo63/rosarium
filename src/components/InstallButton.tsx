'use client'
import { useState, useEffect } from 'react'
import { SmartphoneIcon, XIcon } from 'lucide-react'

export function InstallButton() {
  const [prompt, setPrompt] = useState<{ prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) { setInstalled(true); return }
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(ios)
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e as any) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (installed) return null
  if (!isIOS && !prompt) return null

  const handleInstall = async () => {
    if (isIOS) { setShowTip(true); return }
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }

  return (
    <div className="md:hidden">
      <button onClick={handleInstall}
        className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium py-1">
        <SmartphoneIcon className="w-3.5 h-3.5" />
        Add to home screen
      </button>
      {showTip && (
        <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2 relative">
          <button onClick={() => setShowTip(false)} className="absolute top-2 right-2 text-rose-300 hover:text-rose-500">
            <XIcon className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold">Install on iPhone / iPad:</p>
          <p>1. Tap the <strong>Share</strong> button <span className="font-mono bg-rose-100 px-1 rounded">⎙</span> at the bottom of Safari</p>
          <p>2. Scroll down and tap <strong>Add to Home Screen</strong></p>
          <p>3. Tap <strong>Add</strong></p>
          <p className="text-rose-500 italic">The app opens full-screen like a native app.</p>
        </div>
      )}
    </div>
  )
}