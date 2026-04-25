'use client'
import { useState } from 'react'
import type { Campsite, VisitLog } from '@/types'

type Props = {
  camps: Campsite[]
  defaultCampsiteId?: string
  onSubmit: (data: Omit<VisitLog, 'id' | 'user_id' | 'created_at'>) => Promise<void>
}

export function VisitLogForm({ camps, defaultCampsiteId, onSubmit }: Props) {
  const [campsiteId, setCampsiteId] = useState(defaultCampsiteId ?? '')
  const [visitDate, setVisitDate] = useState('')
  const [rating, setRating] = useState(3)
  const [memo, setMemo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!campsiteId || !visitDate) return
    setSubmitting(true)
    await onSubmit({ campsite_id: campsiteId, visit_date: visitDate, rating, memo, photos: [] })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">キャンプ場</label>
        <select
          value={campsiteId}
          onChange={e => setCampsiteId(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">選択してください</option>
          {camps.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">訪問日</label>
        <input
          type="date"
          value={visitDate}
          onChange={e => setVisitDate(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">評価</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-3xl ${n <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          rows={4}
          placeholder="感想・メモを入力..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        {submitting ? '保存中...' : '記録を保存'}
      </button>
    </form>
  )
}
