'use client'
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
  function toggleAmenity(amenity: Amenity) {
    const next = filter.amenities.includes(amenity)
      ? filter.amenities.filter(a => a !== amenity)
      : [...filter.amenities, amenity]
    onChange({ ...filter, amenities: next })
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
      <input
        type="text"
        placeholder="キャンプ場名・エリアを検索"
        value={filter.search}
        onChange={e => onChange({ ...filter, search: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => onChange({ ...filter, area: null })}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-full border ${filter.area === null ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600'}`}
        >
          すべて
        </button>
        {AREAS.map(area => (
          <button
            key={area}
            onClick={() => onChange({ ...filter, area: filter.area === area ? null : area })}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border ${filter.area === area ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600'}`}
          >
            {area}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PRICE_RANGES.map(p => (
          <button
            key={p.value}
            onClick={() => onChange({ ...filter, price_range: filter.price_range === p.value ? null : p.value })}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border ${filter.price_range === p.value ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {AMENITIES.map(a => (
          <button
            key={a.value}
            onClick={() => toggleAmenity(a.value)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border ${filter.amenities.includes(a.value) ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600'}`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
