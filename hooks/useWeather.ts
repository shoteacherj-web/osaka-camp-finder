import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { DayWeather } from '@/types'

export function useWeather(campsiteId: string) {
  const [forecast, setForecast] = useState<DayWeather[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!campsiteId) return
    setLoading(true)
    supabase
      .from('weather_cache')
      .select('forecast')
      .eq('campsite_id', campsiteId)
      .single()
      .then(({ data, error }) => {
        if (error) console.error('useWeather:', error)
        if (data) setForecast(data.forecast as DayWeather[])
        setLoading(false)
      })
  }, [campsiteId])

  return { forecast, loading }
}
