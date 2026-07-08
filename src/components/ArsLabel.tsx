import { Badge } from '@/components/ui/badge'
import type { RoseEntity } from '@/types/schema'
import { BREEDER_NAMES } from '@/constants'

interface Props { rose: RoseEntity }

export function ArsLabel({ rose }: Props) {
  const parts = [rose.class_code, rose.color_code, rose.breeder_code].filter(Boolean)
  const breederFull = rose.breeder_code ? BREEDER_NAMES[rose.breeder_code] : null
  const title = breederFull ? `${breederFull.name} · ${breederFull.country}` : undefined
  return (
    <Badge className="bg-rose-100 text-rose-800 font-mono text-xs border border-rose-200 cursor-default" title={title}>
      {parts.join(' · ')}
    </Badge>
  )
}
