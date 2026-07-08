export const dynamic = 'force-dynamic'

import { getPlantAnalytics, getTopPerformers } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

export default async function AnalyticsPage() {
  const [all, top] = await Promise.all([getPlantAnalytics(), getTopPerformers(10)])
  return <AnalyticsDashboard data={all} topPerformers={top} />
}

