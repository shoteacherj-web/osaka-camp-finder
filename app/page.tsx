'use client'
import { useState, useEffect } from 'react'
import { useCamps } from '@/hooks/useCamps'
import { CampCard } from '@/components/CampCard'
import { FilterPanel } from '@/components/FilterPanel'
import { supabase } from '@/lib/supabase'
import type { CampsiteFilter, DayWeather } from '@/types'

const DEFAULT_FILTER: CampsiteFilter = {
  area: null,
  price_range: null,
  amenities: [],
  search: '',
}

export default function HomePage() {
  const [filter, setFilter] = useState<CampsiteFilter>(DEFAULT_FILTER)
  const [todayWeatherMap, setTodayWeatherMap] = useState<Record<string, DayWeather>>({})
  const camps = useCamps(filter)

  useEffect(() => {
    supabase
      .from('weather_cache')
      .select('campsite_id, forecast')
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, DayWeather> = {}
        for (const row of data) {
          if (row.forecast?.[0]) map[row.campsite_id] = row.forecast[0]
        }
        setTodayWeatherMap(map)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-green-700">Osaka Camp Finder</h1>
        </div>
        <FilterPanel filter={filter} onChange={setFilter} />
      </header>

      <main className="px-4 py-4 space-y-3 max-w-lg mx-auto">
        <p className="text-sm text-gray-500">{camps.length}件のキャンプ場</p>
        {camps.length === 0 ? (
          <p className="text-center text-gray-400 py-16">条件に合うキャンプ場が見つかりませんでした</p>
        ) : (
          camps.map(camp => (
            <CampCard
              key={camp.id}
              camp={camp}
              todayWeather={todayWeatherMap[camp.id]}
            />
          ))
        )}
      </main>
    </div>
  )
}
