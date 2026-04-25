import Link from 'next/link'
import type { Campsite, DayWeather } from '@/types'

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
  return (
    <Link href={`/camps/${camp.id}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{camp.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{camp.area} · {camp.address}</p>
        </div>
        {isVisited && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">訪問済み</span>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <span className="text-sm font-medium text-gray-700">
          ¥{camp.price_min.toLocaleString()}〜
        </span>
        {todayWeather && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <img
              src={`https://openweathermap.org/img/wn/${todayWeather.icon}.png`}
              alt={todayWeather.condition}
              className="w-6 h-6"
            />
            <span>{Math.round(todayWeather.temp_max)}°/{Math.round(todayWeather.temp_min)}°</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {camp.amenities.map(a => (
          <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {AMENITY_LABELS[a] ?? a}
          </span>
        ))}
      </div>
    </Link>
  )
}
