'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { VisitLog, Campsite } from '@/types'

type Props = {
  log: VisitLog
  camp?: Campsite
  onDelete?: (id: string) => void
}

export function VisitLogCard({ log, camp, onDelete }: Props) {
  const [confirm, setConfirm] = useState(false)

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
              onClick={() => setConfirm(true)}
              className="text-xs text-red-400 hover:text-red-600 ml-1"
            >
              削除
            </button>
          )}
        </div>
      </div>
      {log.memo && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{log.memo}</p>}

      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <p className="font-semibold text-gray-900 text-center mb-1">記録を削除しますか？</p>
            <p className="text-xs text-gray-400 text-center mb-5">この操作は取り消せません</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 font-medium"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => { setConfirm(false); onDelete!(log.id) }}
                className="flex-1 py-2.5 text-sm rounded-xl bg-red-500 text-white font-medium"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
