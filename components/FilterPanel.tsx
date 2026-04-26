'use client'
import { useState } from 'react'
import { BottomSheet } from '@/components/BottomSheet'
import type { Area, Amenity, PriceRange, CampsiteFilter } from '@/types'

const AREAS: Area[] = ['大阪', '兵庫', '京都', '奈良', '和歌山', '滋賀']
const AMENITIES: { value: Amenity; label: string }[] = [
  { value: 'toilet', label: 'トイレ' },
  { value: 'shower', label: 'シャワー' },
  { value: 'power', label: '電源' },
  { value: 'pet', label: 'ペット可' },
]
const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: 'budget', label: '〜2,000円' },
  { value: 'mid', label: '2,001〜4,000円' },
  { value: 'premium', label: '4,001円〜' },
]

type Props = {
  filter: CampsiteFilter
  onChange: (filter: CampsiteFilter) => void
}

export function FilterPanel({ filter, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const activeCount =
    (filter.area ? 1 : 0) +
    (filter.price_range ? 1 : 0) +
    filter.amenities.length

  function toggleAmenity(amenity: Amenity) {
    const next = filter.amenities.includes(amenity)
      ? filter.amenities.filter(a => a !== amenity)
      : [...filter.amenities, amenity]
    onChange({ ...filter, amenities: next })
  }

  function handleReset() {
    onChange({ area: null, price_range: null, amenities: [], search: filter.search })
  }

  return (
    <>
      <div className="px-4 py-2 flex gap-2 items-center">
        <input
          type="text"
          placeholder="キャンプ場名・エリアを検索"
          value={filter.search}
          onChange={e => onChange({ ...filter, search: e.target.value })}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative shrink-0 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
        >
          絞り込み
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="px-4 pb-8 pt-2">
          <h2 className="font-semibold text-gray-900 mb-4">絞り込み</h2>

          <div className="mb-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">エリア</p>
            <div className="flex flex-wrap gap-2">
              {AREAS.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => onChange({ ...filter, area: filter.area === area ? null : area })}
                  className={`text-sm px-4 py-1.5 rounded-full border ${filter.area === area ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">料金帯</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onChange({ ...filter, price_range: filter.price_range === p.value ? null : p.value })}
                  className={`text-sm px-4 py-1.5 rounded-full border ${filter.price_range === p.value ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">設備</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAmenity(a.value)}
                  className={`text-sm px-4 py-1.5 rounded-full border ${filter.amenities.includes(a.value) ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600"
            >
              リセット
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-sm bg-green-600 text-white rounded-xl font-medium"
            >
              この条件で検索
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
