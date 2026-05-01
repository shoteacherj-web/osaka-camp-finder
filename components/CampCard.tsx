'use client'

import Link from 'next/link'
import type { Campsite, DayWeather } from '@/types'
import { useFavoritesStore } from '@/stores/favoritesStore'

const AMENITY_LABELS: Record<string, string> = {
  toilet: 'トイレ',
  shower: 'シャワー',
  power: '電源',
  pet: 'ペット可',
}

type Props = {
  camp: Campsite
  todayWeather?: DayWeather
  isVisited?: boolean
}

export function CampCard({ camp, todayWeather, isVisited }: Props) {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const favorited = useFavoritesStore((s) => s.campIds.includes(camp.id))

  return (
    <div className="relative">
      <Link
        href={`/camps/${camp.id}`}
        className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        {camp.image_url ? (
          <img
            src={camp.image_url}
            alt={camp.name}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-green-900 to-green-500" />
        )}

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base truncate">{camp.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{camp.area} · {camp.address}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
              {isVisited && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">訪問済み</span>
              )}
              {todayWeather && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <img
                    src={`https://openweathermap.org/img/wn/${todayWeather.icon}.png`}
                    alt={todayWeather.condition}
                    className="w-5 h-5"
                  />
                  <span>{Math.round(todayWeather.temp_max)}°/{Math.round(todayWeather.temp_min)}°</span>
                </div>
              )}
            </div>
          </div>

          {camp.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{camp.description}</p>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-semibold text-green-700">
              ¥{camp.price_min.toLocaleString()}〜
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {camp.amenities.slice(0, 3).map(a => (
                <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {AMENITY_LABELS[a] ?? a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={favorited ? 'お気に入りから削除' : 'お気に入りに追加'}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavorite(camp.id)
        }}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-lg leading-none"
      >
        {favorited ? '♥' : '♡'}
      </button>
    </div>
  )
}
