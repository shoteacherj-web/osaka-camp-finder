'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCamps } from '@/hooks/useCamps'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { CompareCard } from '@/components/CompareCard'
import type { Campsite, Amenity, CampsiteFilter } from '@/types'

const DEFAULT_FILTER: CampsiteFilter = { area: null, price_range: null, amenities: [], search: '' }

const COMPARE_ROWS: Array<{ label: string; key: string }> = [
  { label: '料金', key: 'price' },
  { label: 'エリア', key: 'area' },
  { label: 'トイレ', key: 'toilet' },
  { label: 'シャワー', key: 'shower' },
  { label: '電源', key: 'power' },
  { label: 'ペット可', key: 'pet' },
]

const AMENITY_LABELS: Record<string, string> = {
  toilet: 'トイレ', shower: 'シャワー', power: '電源', pet: 'ペット可',
}

function cellValue(camp: Campsite, key: string): string {
  if (key === 'price') return `¥${camp.price_min.toLocaleString()}〜`
  if (key === 'area') return camp.area
  return camp.amenities.includes(key as Amenity) ? '✅' : '❌'
}

export default function FavoritesPage() {
  const { camps: allCamps, loading } = useCamps(DEFAULT_FILTER)
  const { campIds, toggleFavorite } = useFavoritesStore()
  const camps = allCamps.filter(c => campIds.includes(c.id))
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirmId, setConfirmId] = useState<string | null>(null)

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  function handleRemove(id: string) {
    toggleFavorite(id)
    setSelectedIds(prev => prev.filter(x => x !== id))
    setConfirmId(null)
  }

  function resetCompare() {
    setSelectedIds([])
  }

  const camp1 = camps.find(c => c.id === selectedIds[0])
  const camp2 = camps.find(c => c.id === selectedIds[1])
  const comparing = selectedIds.length === 2 && !!camp1 && !!camp2

  // 比較画面
  if (comparing && camp1 && camp2) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto pb-16">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <button type="button" onClick={resetCompare} className="text-green-600 text-sm font-medium">← 戻る</button>
          <h1 className="font-bold text-gray-900">比較</h1>
          <div className="w-16" />
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
              <div key={key} className={`grid grid-cols-3 text-sm ${i < COMPARE_ROWS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="px-3 py-2.5 text-gray-500">{label}</div>
                <div className={`px-3 py-2.5 text-center border-l border-gray-100 ${key === 'price' ? 'font-semibold text-green-700' : ''}`}>{cellValue(camp1, key)}</div>
                <div className={`px-3 py-2.5 text-center border-l border-gray-100 ${key === 'price' ? 'font-semibold text-green-700' : ''}`}>{cellValue(camp2, key)}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href={`/camps/${camp1.id}`} className="text-center text-sm text-green-600 border border-green-600 py-2.5 rounded-xl font-medium hover:bg-green-50">①の詳細を見る</Link>
            <Link href={`/camps/${camp2.id}`} className="text-center text-sm text-green-600 border border-green-600 py-2.5 rounded-xl font-medium hover:bg-green-50">②の詳細を見る</Link>
          </div>
        </div>
      </div>
    )
  }

  // お気に入り一覧画面
  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto pb-16">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-green-600 text-sm shrink-0">← 戻る</Link>
          <h1 className="font-bold text-gray-900">お気に入り</h1>
        </div>
        {camps.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            {selectedIds.length === 0
              ? '「比較する」を2件押すと比較できます'
              : `${selectedIds.length}/2件 選択中 — あと${2 - selectedIds.length}件選んでください`}
          </p>
        )}
      </div>

      <main className="px-4 py-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="w-full aspect-[4/3] bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-7 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : camps.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">♡</p>
            <p className="text-gray-600 font-semibold">お気に入りがありません</p>
            <p className="text-sm text-gray-400 mt-2 mb-8">気に入ったキャンプ場を保存してみましょう</p>
            <Link
              href="/"
              className="inline-block text-sm text-white bg-green-600 px-8 py-3 rounded-xl font-semibold"
            >
              キャンプ場を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {camps.map(camp => {
              const isSelected = selectedIds.includes(camp.id)
              const isFull = selectedIds.length >= 2 && !isSelected
              return (
                <div
                  key={camp.id}
                  className={`bg-white rounded-xl overflow-hidden border transition-all ${isSelected ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-100'}`}
                >
                  <Link href={`/camps/${camp.id}`}>
                    {camp.image_url ? (
                      <img src={camp.image_url} alt={camp.name} className="w-full aspect-[4/3] object-cover" />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gradient-to-br from-green-900 to-green-500" />
                    )}
                  </Link>
                  <div className="p-2.5">
                    <p className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2">{camp.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{camp.area}</p>
                    <p className="text-xs font-medium text-green-700 mt-0.5">¥{camp.price_min.toLocaleString()}〜</p>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => toggleSelect(camp.id)}
                        disabled={isFull}
                        className={`w-full text-xs py-1.5 rounded-lg font-medium border transition-all ${
                          isSelected
                            ? 'bg-green-600 text-white border-green-600'
                            : isFull
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                              : 'border-green-600 text-green-600'
                        }`}
                      >
                        {isSelected ? '✓ 選択中' : '比較する'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(camp.id)}
                        className="w-full text-xs py-1.5 rounded-lg font-medium border border-red-200 text-red-400"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <p className="font-semibold text-gray-900 text-center mb-1">お気に入りから削除しますか？</p>
            <p className="text-xs text-gray-400 text-center mb-5">この操作は取り消せません</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 font-medium"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => handleRemove(confirmId)}
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
