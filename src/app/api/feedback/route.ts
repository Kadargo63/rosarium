import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const RATE_LIMIT_MAP = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_PER_WINDOW = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (RATE_LIMIT_MAP.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= MAX_PER_WINDOW) return true
  timestamps.push(now)
  RATE_LIMIT_MAP.set(ip, timestamps)
  return false
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json()

  // Honeypot check — bots fill this field
  if (body.honeypot) {
    return NextResponse.json({ ok: true }) // silently discard
  }

  const { plant_id, log_id, author_name, rating, tags, comment } = body

  if (!plant_id) {
    return NextResponse.json({ error: 'plant_id required' }, { status: 400 })
  }

  const { error } = await supabase.from('feedback').insert({
    plant_id,
    log_id: log_id ?? null,
    author_name: author_name?.trim() || null,
    rating: rating ?? null,
    tags: tags ?? [],
    comment: comment?.trim() || null,
    honeypot: null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
