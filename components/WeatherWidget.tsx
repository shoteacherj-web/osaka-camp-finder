import type { DayWeather } from '@/types'

const CONDITION_JA: Record<string, string> = {
  Clear: '晴れ',
  Clouds: '曇り',
  Rain: '雨',
  Snow: '雪',
  Drizzle: '小雨',
  Thunderstorm: '雷雨',
  Mist: '霧',
  Fog: '霧',
}

type Props = {
  forecast: DayWeather[]
  loading: boolean
}

export function WeatherWidget({ forecast, loading }: Props) {
  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto py-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shrink-0 w-16 h-28 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (forecast.length === 0) {
    return <p className="text-sm text-gray-400">天気情報を準備中です（初回Cronまでお待ちください）</p>
  }

  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {forecast.map((day, i) => {
        const date = new Date(day.date)
        const label = i === 0 ? '今日' : i === 1 ? '明日' : `${date.getMonth() + 1}/${date.getDate()}`
        return (
          <div key={day.date} className="shrink-0 flex flex-col items-center w-16 bg-sky-50 rounded-xl p-2">
            <span className="text-xs text-gray-500">{label}</span>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.condition}
              className="w-10 h-10"
            />
            <span className="text-xs text-gray-500">{CONDITION_JA[day.condition] ?? day.condition}</span>
            <span className="text-xs font-medium text-red-500">{Math.round(day.temp_max)}°</span>
            <span className="text-xs text-blue-500">{Math.round(day.temp_min)}°</span>
            <span className="text-xs text-gray-400">{Math.round(day.pop * 100)}%</span>
          </div>
        )
      })}
    </div>
  )
}
