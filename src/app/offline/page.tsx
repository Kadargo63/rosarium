'use client'
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center space-y-3 max-w-xs">
        <div className="text-5xl">🌹</div>
        <h1 className="text-xl font-bold text-rose-900">You&apos;re offline</h1>
        <p className="text-sm text-neutral-500">
          Rosarium needs a connection to load fresh data. Check your signal and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}