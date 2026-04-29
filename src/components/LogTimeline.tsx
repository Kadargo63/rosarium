import type { Log } from '@/types/schema'
import { BLOOM_STAGES } from '@/constants'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from './ui/button'

interface Props { logs: Log[]; plantId: string }

const bloomLabel = (val: string | null) => BLOOM_STAGES.find((s) => s.value === val)?.label ?? val

export function LogTimeline({ logs, plantId }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Log History</h2>
        <Link href={`/log/${plantId}`}>
          <Button variant="outline" size="sm" className="text-xs h-7">
            <PlusIcon className="w-3 h-3 mr-1" /> Add Log
          </Button>
        </Link>
      </div>
      {logs.length === 0 && <p className="text-sm text-neutral-400 italic">No logs yet. Start tracking this plant.</p>}
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="bg-white border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <div className="flex gap-2 text-xs">
                {log.vigor != null && <span className="text-emerald-600">V:{log.vigor}</span>}
                {log.health != null && <span className="text-sky-600">H:{log.health}</span>}
                {log.stem_quality != null && <span className="text-violet-600">S:{log.stem_quality}</span>}
              </div>
            </div>
            {log.bloom_stage && (
              <div className="mt-1">
                <span className="text-xs bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded">{bloomLabel(log.bloom_stage)}</span>
              </div>
            )}
            {log.notes && <p className="text-xs text-neutral-500 mt-1.5 italic">{log.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
