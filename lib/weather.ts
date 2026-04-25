import type { DayWeather } from '@/types'

type OWMListItem = {
  dt_txt: string
  main: { temp_max: number; temp_min: number }
  weather: [{ main: string; icon: string }]
  pop: number
}

export async function fetchForecast(lat: number, lng: number): Promise<DayWeather[]> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric&lang=ja`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  const data = await res.json()

  const days: Record<string, DayWeather> = {}
  for (const item of data.list as OWMListItem[]) {
    const date = item.dt_txt.split(' ')[0]
    if (!days[date]) {
      days[date] = {
        date,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        pop: item.pop,
      }
    } else {
      days[date].temp_max = Math.max(days[date].temp_max, item.main.temp_max)
      days[date].temp_min = Math.min(days[date].temp_min, item.main.temp_min)
      days[date].pop = Math.max(days[date].pop, item.pop)
    }
  }
  return Object.values(days).slice(0, 7)
}
