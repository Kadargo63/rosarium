'use client'
import dynamic from 'next/dynamic'
import type { PlantWithDetails, AnalyticsData } from '@/types/schema'
import { GROWTH_TYPE_LABELS, BREEDER_NAMES } from '@/constants'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" /> })

interface Props {
  plants: PlantWithDetails[]
  performanceData: AnalyticsData[]
}

function count<T>(arr: T[], key: (v: T) => string | null | undefined): { labels: string[]; values: number[] } {
  const map: Record<string, number> = {}
  for (const v of arr) {
    const k = key(v) ?? 'Unknown'
    map[k] = (map[k] ?? 0) + 1
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
  return { labels: sorted.map(([k]) => k), values: sorted.map(([, v]) => v) }
}

const ROSE_COLORS = ['#be185d','#9f1239','#e11d48','#f43f5e','#fb7185','#fda4af',
  '#c2410c','#ea580c','#f97316','#fb923c','#fbbf24','#a16207','#166534','#15803d','#1d4ed8','#7c3aed']

export function CollectionCharts({ plants, performanceData }: Props) {
  const byType = count(plants, p => p.rose_entity?.growth_type ? GROWTH_TYPE_LABELS[p.rose_entity.growth_type] : null)
  const byGarden = count(plants, p => p.garden?.name)

  // Breeder: collapse small breeders into "Other"
  const breederRaw = count(plants, p => {
    const code = p.rose_entity?.breeder_code
    return code ? (BREEDER_NAMES[code]?.name ?? code) : 'Unknown'
  })
  const TOP = 8
  const topBreederLabels = breederRaw.labels.slice(0, TOP)
  const topBreederValues = breederRaw.values.slice(0, TOP)
  const otherCount = breederRaw.values.slice(TOP).reduce((s, v) => s + v, 0)
  if (otherCount > 0) { topBreederLabels.push('Other / Unknown'); topBreederValues.push(otherCount) }

  // Country
  const byCountry = count(plants, p => p.rose_entity?.country_of_origin)

  // Propagation status
  const propStatus = count(plants, p => ({
    none: 'No cutting taken',
    cutting_taken: 'Cutting taken',
    propagated: 'Propagated',
  }[p.propagation_status ?? 'none'] ?? 'No cutting taken'))

  // Performance scatter
  const withLogs = performanceData.filter(p => p.log_count > 0)
  const gardenNames = Array.from(new Set(plants.map(p => p.garden?.name ?? 'Unassigned')))
  const gardenColors: Record<string, string> = {}
  gardenNames.forEach((g, i) => { gardenColors[g] = ROSE_COLORS[i % ROSE_COLORS.length]! })

  const plotConfig = { displayModeBar: false, responsive: true }
  const layoutBase = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 10, b: 40, l: 40, r: 10 },
    font: { family: 'Inter, system-ui, sans-serif', size: 12, color: '#525252' },
    showlegend: true,
    legend: { orientation: 'h' as const, y: -0.2, font: { size: 11 } },
  }

  const pieLayout = { ...layoutBase, margin: { t: 0, b: 60, l: 0, r: 0 } }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-rose-900">Collection Analytics</h2>
        <p className="text-sm text-neutral-500 mt-0.5">{plants.length} plants across {gardenNames.length} locations</p>
      </div>

      {/* Row 1: Type + Garden donuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-600 mb-2">By Growth Type</h3>
          <Plot
            data={[{ type: 'pie', labels: byType.labels, values: byType.values, hole: 0.45,
              marker: { colors: ROSE_COLORS }, textinfo: 'label+percent', textposition: 'outside',
              hovertemplate: '<b>%{label}</b><br>%{value} plants (%{percent})<extra></extra>' }]}
            layout={{ ...pieLayout, height: 280 }}
            config={plotConfig} style={{ width: '100%' }}
          />
        </div>
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-600 mb-2">By Garden Location</h3>
          <Plot
            data={[{ type: 'pie', labels: byGarden.labels, values: byGarden.values, hole: 0.45,
              marker: { colors: ROSE_COLORS }, textinfo: 'label+percent', textposition: 'outside',
              hovertemplate: '<b>%{label}</b><br>%{value} plants (%{percent})<extra></extra>' }]}
            layout={{ ...pieLayout, height: 280 }}
            config={plotConfig} style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Row 2: Breeder bar + Propagation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-600 mb-2">By Breeder</h3>
          <Plot
            data={[{ type: 'bar', x: topBreederValues, y: topBreederLabels, orientation: 'h',
              marker: { color: '#be185d', opacity: 0.8 },
              hovertemplate: '<b>%{y}</b>: %{x} plants<extra></extra>' }]}
            layout={{ ...layoutBase, height: 280, showlegend: false,
              xaxis: { title: 'Plants' }, yaxis: { automargin: true },
              margin: { t: 10, b: 40, l: 140, r: 10 } }}
            config={plotConfig} style={{ width: '100%' }}
          />
        </div>
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-600 mb-2">Propagation Status</h3>
          <Plot
            data={[{ type: 'pie', labels: propStatus.labels, values: propStatus.values, hole: 0.45,
              marker: { colors: ['#d1d5db','#f59e0b','#16a34a'] },
              textinfo: 'label+value', textposition: 'outside',
              hovertemplate: '<b>%{label}</b><br>%{value} plants (%{percent})<extra></extra>' }]}
            layout={{ ...pieLayout, height: 280 }}
            config={plotConfig} style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Row 3: Country bar */}
      {byCountry.labels.length > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-600 mb-2">Country of Origin</h3>
          <Plot
            data={[{ type: 'bar', x: byCountry.labels, y: byCountry.values,
              marker: { color: ROSE_COLORS },
              hovertemplate: '<b>%{x}</b>: %{y} plants<extra></extra>' }]}
            layout={{ ...layoutBase, height: 220, showlegend: false,
              xaxis: { automargin: true }, yaxis: { title: 'Plants' },
              margin: { t: 10, b: 80, l: 50, r: 10 } }}
            config={plotConfig} style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Row 4: Performance scatter (only if log data exists) */}
      {withLogs.length > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-600 mb-1">Vigor vs Health — All Logged Plants</h3>
          <p className="text-xs text-neutral-400 mb-2">Bubble size = number of logs. Hover for plant details.</p>
          <Plot
            data={gardenNames.map(garden => {
              const pts = withLogs.filter(p => {
                const plant = plants.find(pl => pl.id === p.plant_id)
                return (plant?.garden?.name ?? 'Unassigned') === garden
              })
              return {
                type: 'scatter' as const,
                mode: 'markers' as const,
                name: garden,
                x: pts.map(p => p.avg_vigor),
                y: pts.map(p => p.avg_health),
                text: pts.map(p => p.label_name),
                marker: { size: pts.map(p => Math.max(8, Math.min(30, p.log_count * 4))), color: gardenColors[garden], opacity: 0.8 },
                hovertemplate: '<b>%{text}</b><br>Vigor: %{x:.1f}  Health: %{y:.1f}<extra>%{fullData.name}</extra>',
              }
            })}
            layout={{ ...layoutBase, height: 360,
              xaxis: { title: 'Avg Vigor', range: [0, 5.2] },
              yaxis: { title: 'Avg Health', range: [0, 5.2] },
              margin: { t: 10, b: 50, l: 60, r: 10 } }}
            config={plotConfig} style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  )
}