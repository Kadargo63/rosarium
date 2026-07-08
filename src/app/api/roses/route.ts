import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const [{ data: roses, error: rErr }, { data: gardens, error: gErr }] = await Promise.all([
    supabase.from('rose_entities').select('*').order('canonical_name'),
    supabase.from('gardens').select('*').order('name'),
  ])
  if (rErr || gErr) {
    return NextResponse.json({ error: rErr?.message ?? gErr?.message }, { status: 500 })
  }
  return NextResponse.json({ roses: roses ?? [], gardens: gardens ?? [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabase.from('rose_entities').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}