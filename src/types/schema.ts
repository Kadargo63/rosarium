export type GrowthType = 'hybrid_tea' | 'floribunda' | 'climber' | 'shrub' | 'polyantha' | 'grandiflora' | 'miniature' | 'old_garden'
export type PruningModel = 'NEW_GROWTH_DOMINANT' | 'MIXED_CANE' | 'OLD_WOOD_SENSITIVE'
export type SunIndex = 'EARLY_SOFT' | 'MID_BALANCED' | 'LATE_INTENSE'
export type BloomStage = 'dormant' | 'budding' | 'bud' | 'half_open' | 'open' | 'fully_open' | 'spent' | 'hip_forming'
export type AliasType = 'trade' | 'nursery' | 'common' | 'mislabel'
export type PlantStructureType = 'cane' | 'stem_cluster' | 'vine_runner' | 'woody_branch'
export type PropagationStatus = 'none' | 'cutting_taken' | 'propagated'
export type BatchStatus = 'active' | 'complete' | 'abandoned'

export interface PropagationBatch {
  id: string
  parent_plant_id: string
  batch_code: string
  date_taken: string
  initial_count: number
  notes: string | null
  status: BatchStatus
  created_at: string
  parent_plant?: { label_name: string; rose_entity?: { canonical_name: string } | null }
  latest_update?: PropagationBatchUpdate | null
}

export interface PropagationBatchUpdate {
  id: string
  batch_id: string
  update_date: string
  viable_count: number | null
  failed_count: number | null
  rooted_count: number | null
  notes: string | null
  created_at: string
}

export interface RoseEntity {
  id: string
  canonical_name: string
  ars_registration_name: string | null
  breeder_code: string | null
  class_code: string | null
  color_code: string | null
  growth_type: GrowthType | null
  pruning_model: PruningModel | null
  plant_structure_type: PlantStructureType
  year_introduced: number | null
  species: string | null
  notes: string | null
  country_of_origin: string | null
  created_at: string
}

export interface RoseAlias {
  id: string
  rose_id: string
  alias: string
  alias_type: AliasType
  confidence: number
}

export interface Garden {
  id: string
  name: string
  description: string | null
  location_notes: string | null
  sun_index: SunIndex | null
  user_id: string | null
  created_at: string
}

export interface Plant {
  id: string
  rose_id: string | null
  garden_id: string | null
  label_name: string
  position_index: number | null
  date_planted: string | null
  notes: string | null
  sun_index: SunIndex | null
  user_id: string | null
  created_at: string
  propagation_status?: PropagationStatus
  propagation_notes?: string | null
  rose_entity?: RoseEntity
  garden?: Garden
}

export interface Log {
  id: string
  plant_id: string
  date: string
  vigor: number | null
  health: number | null
  bloom_stage: BloomStage | null
  stem_quality: number | null
  notes: string | null
  created_at: string
}

export interface Photo {
  id: string
  plant_id: string
  log_id: string | null
  image_url: string
  taken_at: string
  notes: string | null
}

export type FeedbackTag = 'structure' | 'health' | 'bloom_quality' | 'airflow' | 'pruning_suggestion' | 'color' | 'fragrance' | 'disease'

export interface Feedback {
  id: string
  plant_id: string
  log_id: string | null
  author_name: string | null
  rating: number | null
  tags: FeedbackTag[]
  comment: string | null
  created_at: string
}

export interface PlantWithDetails extends Plant {
  rose_entity: RoseEntity
  garden: Garden
  latest_log?: Log
  log_count?: number
}

export interface AnalyticsData {
  plant_id: string
  label_name: string
  canonical_name: string
  avg_vigor: number
  avg_health: number
  log_count: number
  last_log_date: string | null
  avg_bloom_interval_days: number | null
}
