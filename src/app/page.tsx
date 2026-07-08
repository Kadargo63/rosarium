export const dynamic = 'force-dynamic'

import { getPlants } from '@/lib/queries'
import { getNeedsAttention, getTopPerformers } from '@/lib/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PhoneQR } from '@/components/PhoneQR'
import { InstallButton } from '@/components/InstallButton'
import Link from 'next/link'

export default async function DashboardPage() {
  const [plants, topPerformers, needsAttention] = await Promise.all([
    getPlants(),
    getTopPerformers(5),
    getNeedsAttention(9),
  ])

  const totalPlants = plants.length
  const loggedThisWeek = plants.filter((p) => {
    if (!p.latest_log) return false
    const d = new Date(p.latest_log.date)
    return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-rose-900">Rosarium</h1>
          <p className="text-neutral-500 text-sm mt-1">Your rose intelligence system</p>
          <InstallButton />
        </div>
        <div className="hidden md:block flex-shrink-0">
          <PhoneQR />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-rose-700">{totalPlants}</div>
            <div className="text-xs text-neutral-500">Total Plants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">{loggedThisWeek}</div>
            <div className="text-xs text-neutral-500">Logged This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-500">{needsAttention.length}</div>
            <div className="text-xs text-neutral-500">Need Attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-sky-600">{topPerformers[0]?.avg_vigor.toFixed(1) ?? '—'}</div>
            <div className="text-xs text-neutral-500">Best Avg Vigor</div>
          </CardContent>
        </Card>
      </div>

      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-800">Needs Logging (9+ days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {needsAttention.slice(0, 8).map((p) => (
                <Link key={p.plant_id} href={`/log/${p.plant_id}`}>
                  <Badge variant="outline" className="cursor-pointer border-amber-400 text-amber-700 hover:bg-amber-100">
                    {p.label_name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top performers */}
      {topPerformers.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-neutral-600 mb-2">Top Performers</h2>
          <div className="space-y-2">
            {topPerformers.map((p) => (
              <Link key={p.plant_id} href={`/plants/${p.plant_id}`} className="block">
                <Card className="hover:bg-rose-50 transition-colors">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{p.label_name}</div>
                      <div className="text-xs text-neutral-400">{p.canonical_name}</div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-emerald-600">V: {p.avg_vigor.toFixed(1)}</span>
                      <span className="text-sky-600">H: {p.avg_health.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick add log */}
      <div className="text-center pt-2">
        <Link href="/plants" className="text-rose-600 text-sm font-medium hover:underline">
          View all plants →
        </Link>
      </div>
    </div>
  )
}

