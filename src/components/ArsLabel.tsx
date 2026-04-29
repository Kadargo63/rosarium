import { Badge } from '@/components/ui/badge'
import type { RoseEntity } from '@/types/schema'

interface Props { rose: RoseEntity }

export function ArsLabel({ rose }: Props) {
  const parts = [rose.class_code, rose.color_code, rose.breeder_code].filter(Boolean)
  return (
    <Badge className="bg-rose-100 text-rose-800 font-mono text-xs border border-rose-200">
      {parts.join(' · ')}
    </Badge>
  )
}
