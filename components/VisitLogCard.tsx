import Link from 'next/link'
import type { VisitLog, Campsite } from '@/types'

type Props = {
  log: VisitLog
  camp?: Campsite
  onDelete?: (id: string) => void
}

export function VisitLogCard({ log, camp, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          {camp && (
            <Link href={`/camps/${camp.id}`} className="font-semibold text-gray-900 hover:underline">
              {camp.name}
            </Link>
          )}
          <p className="text-sm text-gray-400 mt-0.5">{log.visit_date}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-sm">
            {'★'.repeat(log.rating)}{'☆'.repeat(5 - log.rating)}
          </span>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(log.id)}
              className="text-xs text-red-400 hover:text-red-600 ml-1"
            >
              削除
            </button>
          )}
        </div>
      </div>
      {log.memo && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{log.memo}</p>}
    </div>
  )
}
