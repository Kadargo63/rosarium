import { supabase } from './supabase'
import type { Plant, Log, Photo, Feedback, RoseEntity, Garden, PlantWithDetails } from '@/types/schema'

export async function getPlants(): Promise<PlantWithDetails[]> {
  const [{ data: plants, error: pErr }, { data: allLogs, error: lErr }] = await Promise.all([
    supabase
      .from('plants')
      .select('*, rose_entity:rose_entities(*), garden:gardens(*)')
      .order('created_at', { ascending: true }),
    supabase
      .from('logs')
      .select('id, plant_id, date, vigor, health, bloom_stage, stem_quality, notes, created_at')
      .order('date', { ascending: false }),
  ])
  if (pErr) throw pErr
  if (lErr) throw lErr

  const latestLogMap: Record<string, Log> = {}
  const logCountMap: Record<string, number> = {}
  for (const log of (allLogs ?? []) as Log[]) {
    logCountMap[log.plant_id] = (logCountMap[log.plant_id] ?? 0) + 1
    if (!latestLogMap[log.plant_id]) latestLogMap[log.plant_id] = log
  }

  return ((plants ?? []) as PlantWithDetails[]).map((p) => ({
    ...p,
    latest_log: latestLogMap[p.id],
    log_count: logCountMap[p.id] ?? 0,
  }))
}

export async function getPlant(id: string): Promise<PlantWithDetails | null> {
  const { data, error } = await supabase
    .from('plants')
    .select(`*, rose_entity:rose_entities(*), garden:gardens(*)`)
    .eq('id', id)
    .single()
  if (error) return null
  return data as PlantWithDetails
}

export async function createPlant(plant: Omit<Plant, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('plants').insert(plant).select().single()
  if (error) throw error
  return data
}

export async function updatePlant(id: string, updates: Partial<Plant>) {
  const { data, error } = await supabase.from('plants').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function getLogsByPlant(plantId: string): Promise<Log[]> {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('plant_id', plantId)
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createLog(log: Omit<Log, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('logs').insert(log).select().single()
  if (error) throw error
  return data
}

export async function getPhotosByPlant(plantId: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('plant_id', plantId)
    .order('taken_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createPhoto(photo: Omit<Photo, 'id'>) {
  const { data, error } = await supabase.from('photos').insert(photo).select().single()
  if (error) throw error
  return data
}

export async function uploadPhoto(plantId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `plants/${plantId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('rosarium-photos').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('rosarium-photos').getPublicUrl(path)
  return data.publicUrl
}

export async function getFeedbackByPlant(plantId: string): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('plant_id', plantId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('feedback').insert(feedback).select().single()
  if (error) throw error
  return data
}

export async function getRoseEntities(): Promise<RoseEntity[]> {
  const { data, error } = await supabase.from('rose_entities').select('*, rose_aliases(*)').order('canonical_name')
  if (error) throw error
  return data ?? []
}

export async function getGardens(): Promise<Garden[]> {
  const { data, error } = await supabase.from('gardens').select('*').order('name')
  if (error) throw error
  return data ?? []
}

// ── Propagation Batches ────────────────────────────────────────────────────

export async function createPropagationBatch(batch: {
  parent_plant_id: string
  batch_code: string
  date_taken: string
  initial_count: number
  notes: string | null
  status: 'active'
}) {
  const { data, error } = await supabase.from('propagation_batches').insert(batch).select().single()
  if (error) throw error
  return data
}

export async function getActiveBatches() {
  const { data, error } = await supabase
    .from('propagation_batches')
    .select('*, parent_plant:plants(label_name, rose_entity:rose_entities(canonical_name)), propagation_batch_updates(*)')
    .eq('status', 'active')
    .order('date_taken', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getBatchesByPlant(plantId: string) {
  const { data, error } = await supabase
    .from('propagation_batches')
    .select('*, propagation_batch_updates(*)')
    .eq('parent_plant_id', plantId)
    .order('date_taken', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function addBatchUpdate(update: {
  batch_id: string
  update_date: string
  viable_count: number | null
  failed_count: number | null
  rooted_count: number | null
  notes: string | null
}) {
  const { data, error } = await supabase.from('propagation_batch_updates').insert(update).select().single()
  if (error) throw error
  return data
}

export async function updateBatchStatus(batchId: string, status: 'active' | 'complete' | 'abandoned') {
  const { error } = await supabase.from('propagation_batches').update({ status }).eq('id', batchId)
  if (error) throw error
}
