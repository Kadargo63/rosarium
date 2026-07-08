import { BloomStage, FeedbackTag, GrowthType, PruningModel } from '@/types/schema'

export const BLOOM_STAGES: { value: BloomStage; label: string }[] = [
  { value: 'dormant', label: 'Dormant' },
  { value: 'budding', label: 'Budding' },
  { value: 'bud', label: 'Bud' },
  { value: 'half_open', label: 'Half Open' },
  { value: 'open', label: 'Open' },
  { value: 'fully_open', label: 'Fully Open' },
  { value: 'spent', label: 'Spent' },
  { value: 'hip_forming', label: 'Hip Forming' },
]

export const FEEDBACK_TAGS: { value: FeedbackTag; label: string }[] = [
  { value: 'structure', label: 'Structure' },
  { value: 'health', label: 'Health' },
  { value: 'bloom_quality', label: 'Bloom Quality' },
  { value: 'airflow', label: 'Airflow' },
  { value: 'pruning_suggestion', label: 'Pruning Suggestion' },
  { value: 'color', label: 'Color' },
  { value: 'fragrance', label: 'Fragrance' },
  { value: 'disease', label: 'Disease' },
]

export const PRUNING_MODEL_LABELS: Record<PruningModel, string> = {
  NEW_GROWTH_DOMINANT: 'New Growth',
  MIXED_CANE: 'Mixed Cane',
  OLD_WOOD_SENSITIVE: 'Old Wood',
}

export const GROWTH_TYPE_LABELS: Record<GrowthType, string> = {
  hybrid_tea: 'Hybrid Tea',
  floribunda: 'Floribunda',
  climber: 'Climber',
  shrub: 'Shrub',
  polyantha: 'Polyantha',
  grandiflora: 'Grandiflora',
  miniature: 'Miniature',
  old_garden: 'Old Garden',
}

export const COLOR_CODE_LABELS: Record<string, string> = {
  w: 'White',
  ly: 'Light Yellow',
  my: 'Medium Yellow',
  dy: 'Deep Yellow',
  lp: 'Light Pink',
  mp: 'Medium Pink',
  dp: 'Deep Pink',
  mr: 'Medium Red',
  dr: 'Deep Red',
  or: 'Orange-Red',
  ob: 'Orange Blend',
  ab: 'Apricot Blend',
  yb: 'Yellow Blend',
  pb: 'Pink Blend',
  rb: 'Red Blend',
  m: 'Mauve',
  v: 'Violet',
}

export const PRUNING_MODEL_COLORS: Record<PruningModel, string> = {
  NEW_GROWTH_DOMINANT: 'bg-green-100 text-green-800',
  MIXED_CANE: 'bg-yellow-100 text-yellow-800',
  OLD_WOOD_SENSITIVE: 'bg-orange-100 text-orange-800',
}

export const BREEDER_NAMES: Record<string, { name: string; country: string }> = {
  // United States
  JAC:  { name: 'Jackson & Perkins',   country: 'USA' },
  WEK:  { name: 'Weeks Roses',          country: 'USA' },
  RAD:  { name: 'Radler / Knock Out',   country: 'USA' },
  ARO:  { name: 'Armstrong Roses',      country: 'USA' },
  BUC:  { name: 'Griffith Buck',        country: 'USA' },
  MOO:  { name: 'Ralph Moore',          country: 'USA' },
  SAV:  { name: 'Harmon Saville',       country: 'USA' },
  SP:   { name: 'Spring Hill Nurseries',country: 'USA' },
  MIN:  { name: 'Miniature Roses Inc.', country: 'USA' },
  // Germany
  KOR:  { name: 'W. Kordes & Sons',     country: 'Germany' },
  TAN:  { name: 'Mathias Tantau',       country: 'Germany' },
  // France
  MEI:  { name: 'Meilland International', country: 'France' },
  DEL:  { name: 'Delbard',              country: 'France' },
  // England
  AUS:  { name: 'David Austin Roses',   country: 'England' },
  HAR:  { name: 'R. Harkness & Co.',    country: 'England' },
  FRY:  { name: "Fryer's Roses",        country: 'England' },
  CAR:  { name: 'Cants of Colchester',  country: 'England' },
  SCR:  { name: 'Scrivens',             country: 'England' },
  // Northern Ireland / Scotland
  DIC:  { name: 'Dickson Nurseries',    country: 'Northern Ireland' },
  COC:  { name: "Cocker's Roses",       country: 'Scotland' },
  McG:  { name: 'Sam McGredy',          country: 'New Zealand' },
  MCG:  { name: 'Sam McGredy',          country: 'New Zealand' },
  // Netherlands / Denmark
  HOR:  { name: 'De Ruiter / Interplant', country: 'Netherlands' },
  POE:  { name: 'Poulsen Roser',        country: 'Denmark' },
  // Other
  DEF:  { name: 'De Vink',              country: 'Netherlands' },
}
