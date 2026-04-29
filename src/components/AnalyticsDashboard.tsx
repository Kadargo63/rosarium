"use client"
import type { AnalyticsData } from '@/types/schema'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Link from 'next/link'

interface Props { data: AnalyticsData[]; topPerformers: AnalyticsData[] }

export function AnalyticsDashboard({ data, topPerformers }: Props) {
  const logged = data.filter((d) => d.log_count > 0)
  const chartData = topPerformers.map((p) => ({
    name: p.label_name.replace(' Rose', '').slice(0, 16),
    vigor: p.avg_vigor,
    health: p.avg_health,
    plant_id: p.plant_id,
  }))

  const avgVigorAll = logged.length
    ? (logged.reduce((s, p) => s + p.avg_vigor, 0) / logged.length).toFixed(1)
    : '—'
  const avgHealthAll = logged.length
    ? (logged.reduce((s, p) => s + p.avg_health, 0) / logged.length).toFixed(1)
    : '—'
  const totalLogs = data.reduce((s, p) => s + p.log_count, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-rose-900">Analytics</h1>

      {/* Garden-wide stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-emerald-700">{avgVigorAll}</div>
          <div className="text-xs text-emerald-600">Garden Avg Vigor</div>
        </div>
        <div className="bg-sky-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-sky-700">{avgHealthAll}</div>
          <div className="text-xs text-sky-600">Garden Avg Health</div>
        </div>
        <div className="bg-rose-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-rose-700">{totalLogs}</div>
          <div className="text-xs text-rose-600">Total Logs</div>
        </div>
      </div>

      {/* Top performers chart */}
      {chartData.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-neutral-600 mb-3">Top Performers — Vigor & Health</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => (typeof val === 'number' ? val.toFixed(1) : val)} />
              <Bar dataKey="vigor" fill="#059669" radius={[4,4,0,0]} name="Vigor" />
              <Bar dataKey="health" fill="#0284c7" radius={[4,4,0,0]} name="Health" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Full table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b bg-neutral-50">
          <h2 className="text-sm font-semibold text-neutral-600">All Plants</h2>
        </div>
        <div className="divide-y">
          {data.sort((a, b) => (b.avg_vigor + b.avg_health) - (a.avg_vigor + a.avg_health)).map((p) => (
            <Link key={p.plant_id} href={`/plants/${p.plant_id}`} className="flex items-center px-4 py-2.5 hover:bg-neutral-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.label_name}</p>
                <p className="text-xs text-neutral-400">{p.log_count} logs{p.last_log_date ? ` · last ${new Date(p.last_log_date).toLocaleDateString()}` : ''}</p>
              </div>
              <div className="flex gap-3 text-xs ml-2 shrink-0">
                <span className="text-emerald-600">V:{p.log_count ? p.avg_vigor.toFixed(1) : '—'}</span>
                <span className="text-sky-600">H:{p.log_count ? p.avg_health.toFixed(1) : '—'}</span>
                {p.avg_bloom_interval_days && <span className="text-pink-500">{p.avg_bloom_interval_days}d</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
