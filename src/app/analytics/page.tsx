export const dynamic = 'force-dynamic'

import { getPlantAnalytics, getTopPerformers } from '@/lib/analytics'
import { getPlants } from '@/lib/queries'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { CollectionCharts } from '@/components/CollectionCharts'

export default async function AnalyticsPage() {
  const [all, top, plants] = await Promise.all([
    getPlantAnalytics(),
    getTopPerformers(10),
    getPlants(),
  ])
  return (
    <div className="space-y-8">
      <CollectionCharts plants={plants} performanceData={all} />
      <AnalyticsDashboard data={all} topPerformers={top} />
    </div>
  )
}

