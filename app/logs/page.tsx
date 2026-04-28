'use client'
import Link from 'next/link'
import { useVisitLogs } from '@/hooks/useVisitLogs'
import { useCamps } from '@/hooks/useCamps'
import { VisitLogCard } from '@/components/VisitLogCard'

import type { CampsiteFilter } from '@/types'

const DEFAULT_FILTER: CampsiteFilter = { area: null, price_range: null, amenities: [], search: '' }

export default function LogsPage() {
  const { logs, loading, deleteLog } = useVisitLogs()
  const { camps } = useCamps(DEFAULT_FILTER)

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-green-600 text-sm shrink-0">← 戻る</Link>
            <h1 className="font-bold text-gray-900">訪問記録</h1>
          </div>
          <Link href="/logs/new" className="text-sm text-green-600 font-medium">+ 追加</Link>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-6">まだ訪問記録がありません</p>
            <Link href="/logs/new" className="text-sm bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
              最初の記録を追加
            </Link>
          </div>
        ) : (
          logs.map(log => {
            const camp = camps.find(c => c.id === log.campsite_id)
            return (
              <VisitLogCard key={log.id} log={log} camp={camp} onDelete={deleteLog} />
            )
          })
        )}
      </div>
    </div>
  )
}
