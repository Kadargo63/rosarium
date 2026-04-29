import { supabase } from './supabase'
import type { RoseEntity } from '@/types/schema'

export interface ResolveResult {
  entity: RoseEntity
  matched_alias: string | null
  confidence: number
}

export async function resolveRose(input: string): Promise<ResolveResult[]> {
  const term = input.trim().toLowerCase()
  if (!term) return []

  const { data, error } = await supabase
    .from('rose_entities')
    .select('*, rose_aliases(*)')

  if (error || !data) return []

  const results: ResolveResult[] = []

  for (const entity of data) {
    const canonicalLower = entity.canonical_name.toLowerCase()
    if (canonicalLower.includes(term)) {
      results.push({ entity, matched_alias: null, confidence: canonicalLower === term ? 1.0 : 0.85 })
      continue
    }
    const aliases = (entity.rose_aliases ?? []) as { alias: string }[]
    for (const alias of aliases) {
      const a = alias as { alias: string }
      const aliasLower = a.alias.toLowerCase()
      if (aliasLower.includes(term)) {
        results.push({ entity, matched_alias: a.alias, confidence: aliasLower === term ? 0.95 : 0.75 })
        break
      }
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}
