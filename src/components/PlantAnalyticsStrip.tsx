import type { Log } from '@/types/schema'

interface Props { logs: Log[] }

export function PlantAnalyticsStrip({ logs }: Props) {
  if (logs.length === 0) return null

  const withVigor = logs.filter((l) => l.vigor != null)
  const withHealth = logs.filter((l) => l.health != null)
  const avgVigor = withVigor.length ? (withVigor.reduce((s, l) => s + l.vigor!, 0) / withVigor.length).toFixed(1) : null
  const avgHealth = withHealth.length ? (withHealth.reduce((s, l) => s + l.health!, 0) / withHealth.length).toFixed(1) : null

  const bloomDates = logs
    .filter((l) => l.bloom_stage === 'open' || l.bloom_stage === 'fully_open')
    .map((l) => new Date(l.date).getTime())
    .sort((a, b) => a - b)

  let avgInterval: number | null = null
  if (bloomDates.length >= 2) {
    const intervals = bloomDates.slice(1).map((d, i) => Math.round((d - bloomDates[i]!) / 86400000))
    avgInterval = Math.round(intervals.reduce((s, v) => s + v, 0) / intervals.length)
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-emerald-50 rounded-lg p-3 text-center">
        <div className="text-lg font-bold text-emerald-700">{avgVigor ?? '—'}</div>
        <div className="text-xs text-emerald-600">Avg Vigor</div>
      </div>
      <div className="bg-sky-50 rounded-lg p-3 text-center">
        <div className="text-lg font-bold text-sky-700">{avgHealth ?? '—'}</div>
        <div className="text-xs text-sky-600">Avg Health</div>
      </div>
      <div className="bg-pink-50 rounded-lg p-3 text-center">
        <div className="text-lg font-bold text-pink-700">{avgInterval ? `${avgInterval}d` : '—'}</div>
        <div className="text-xs text-pink-600">Bloom Interval</div>
      </div>
    </div>
  )
}
