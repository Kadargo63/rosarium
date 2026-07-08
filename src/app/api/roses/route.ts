import { NextResponse } from 'next/server'
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