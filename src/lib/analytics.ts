import { supabase } from './supabase'
import type { AnalyticsData } from '@/types/schema'

interface RawLog {
  plant_id: string
  date: string
  vigor: number | null
  health: number | null
  bloom_stage: string | null
}

interface RawPlant {
  id: string
  label_name: string
  rose_entity: Array<{ canonical_name: string }> | { canonical_name: string } | null
}

export async function getPlantAnalytics(): Promise<AnalyticsData[]> {
  const { data: plants, error: pErr } = await supabase
    .from('plants')
    .select('id, label_name, rose_entity:rose_entities(canonical_name)')
  if (pErr) throw pErr

  const { data: logs, error: lErr } = await supabase
    .from('logs')
    .select('plant_id, date, vigor, health, bloom_stage')
    .order('date', { ascending: true })
  if (lErr) throw lErr

  const logsByPlant = (logs as RawLog[] ?? []).reduce<Record<string, RawLog[]>>((acc, log) => {
    if (!acc[log.plant_id]) acc[log.plant_id] = []
    acc[log.plant_id]!.push(log)
    return acc
  }, {})

  return (plants as unknown as RawPlant[] ?? []).map((p) => {
    const plantLogs = logsByPlant[p.id] ?? []
    const withVigor = plantLogs.filter((l) => l.vigor != null)
    const withHealth = plantLogs.filter((l) => l.health != null)

    const avg_vigor = withVigor.length
      ? withVigor.reduce((s, l) => s + (l.vigor ?? 0), 0) / withVigor.length
      : 0
    const avg_health = withHealth.length
      ? withHealth.reduce((s, l) => s + (l.health ?? 0), 0) / withHealth.length
      : 0

    const bloomDates = plantLogs
      .filter((l) => l.bloom_stage === 'open' || l.bloom_stage === 'fully_open')
      .map((l) => new Date(l.date).getTime())
      .sort((a, b) => a - b)

    let avg_bloom_interval_days: number | null = null
    if (bloomDates.length >= 2) {
      const intervals = bloomDates.slice(1).map((d, i) =>
        Math.round((d - bloomDates[i]!) / (1000 * 60 * 60 * 24))
      )
      avg_bloom_interval_days = Math.round(intervals.reduce((s, v) => s + v, 0) / intervals.length)
    }

    const sortedLogs = [...plantLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return {
      plant_id: p.id,
      label_name: p.label_name,
      canonical_name: (Array.isArray(p.rose_entity) ? p.rose_entity[0]?.canonical_name : p.rose_entity?.canonical_name) ?? p.label_name,
      avg_vigor: Math.round(avg_vigor * 10) / 10,
      avg_health: Math.round(avg_health * 10) / 10,
      log_count: plantLogs.length,
      last_log_date: sortedLogs[0]?.date ?? null,
      avg_bloom_interval_days,
    }
  })
}

export async function getTopPerformers(limit = 5): Promise<AnalyticsData[]> {
  const all = await getPlantAnalytics()
  return all
    .filter((p) => p.log_count > 0)
    .sort((a, b) => (b.avg_vigor + b.avg_health) - (a.avg_vigor + a.avg_health))
    .slice(0, limit)
}

export async function getNeedsAttention(daysSinceLog = 9): Promise<AnalyticsData[]> {
  const all = await getPlantAnalytics()
  const cutoff = Date.now() - daysSinceLog * 24 * 60 * 60 * 1000
  return all.filter((p) => {
    if (!p.last_log_date) return true
    return new Date(p.last_log_date).getTime() < cutoff
  })
}
