import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { PropagationStatus } from '@/types/schema'

const VALID_STATUSES: PropagationStatus[] = ['none', 'cutting_taken', 'propagated']

export async function PATCH(
  req: NextRequest,
  { params }: { params: { plantId: string } },
) {
  const { plantId } = params
  if (!plantId) {
    return NextResponse.json({ error: 'plantId required' }, { status: 400 })
  }

  let body: { status?: unknown; notes?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { status, notes } = body

  if (typeof status !== 'string' || !VALID_STATUSES.includes(status as PropagationStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { error } = await supabase
    .from('plants')
    .update({
      propagation_status: status as PropagationStatus,
      propagation_notes: typeof notes === 'string' ? notes.trim() || null : null,
    })
    .eq('id', plantId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}