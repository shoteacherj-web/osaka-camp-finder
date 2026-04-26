'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import campsData from '@/data/camps.json'
import { useCompareStore } from '@/stores/compareStore'
import { CompareCard } from '@/components/CompareCard'
import type { Campsite, Amenity } from '@/types'

const COMPARE_ROWS: Array<{ label: string; key: string }> = [
  { label: '料金', key: 'price' },
  { label: 'エリア', key: 'area' },
  { label: 'トイレ', key: 'toilet' },
  { label: 'シャワー', key: 'shower' },
  { label: '電源', key: 'power' },
  { label: 'ペット可', key: 'pet' },
]

function cellValue(camp: Campsite, key: string): string {
  if (key === 'price') return `¥${camp.price_min.toLocaleString()}〜`
  if (key === 'area') return camp.area
  return camp.amenities.includes(key as Amenity) ? '✅' : '❌'
}

export default function ComparePage() {
  const router = useRouter()
  const { campIds, clearCompare } = useCompareStore()
  const camps = campsData as Campsite[]

  const camp1 = campIds[0] ? camps.find(c => c.id === campIds[0]) : undefined
  const camp2 = campIds[1] ? camps.find(c => c.id === campIds[1]) : undefined

  useEffect(() => {
    if (!camp1 || !camp2) router.replace('/')
  }, [camp1, camp2, router])

  if (!camp1 || !camp2) return null

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <Link href="/" className="text-green-600 shrink-0">← 戻る</Link>
        <h1 className="font-bold text-gray-900">比較</h1>
        <button
          type="button"
          onClick={() => { clearCompare(); router.push('/') }}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          リセット
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <CompareCard camp={camp1} index={1} />
          <CompareCard camp={camp2} index={2} />
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
            <div className="px-3 py-2 text-xs font-medium text-gray-400">項目</div>
            <div className="px-3 py-2 text-xs font-medium text-gray-700 text-center border-l border-gray-100">①</div>
            <div className="px-3 py-2 text-xs font-medium text-gray-700 text-center border-l border-gray-100">②</div>
          </div>
          {COMPARE_ROWS.map(({ label, key }, i) => (
            <div
              key={key}
              className={`grid grid-cols-3 text-sm ${i < COMPARE_ROWS.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="px-3 py-2.5 text-gray-500">{label}</div>
              <div className={`px-3 py-2.5 text-center border-l border-gray-100 ${key === 'price' ? 'font-semibold text-green-700' : ''}`}>
                {cellValue(camp1, key)}
              </div>
              <div className={`px-3 py-2.5 text-center border-l border-gray-100 ${key === 'price' ? 'font-semibold text-green-700' : ''}`}>
                {cellValue(camp2, key)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/camps/${camp1.id}`}
            className="text-center text-sm text-green-600 border border-green-600 py-2.5 rounded-xl font-medium hover:bg-green-50"
          >
            ①の詳細を見る
          </Link>
          <Link
            href={`/camps/${camp2.id}`}
            className="text-center text-sm text-green-600 border border-green-600 py-2.5 rounded-xl font-medium hover:bg-green-50"
          >
            ②の詳細を見る
          </Link>
        </div>
      </div>
    </div>
  )
}
