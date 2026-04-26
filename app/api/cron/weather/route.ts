import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import campsData from '@/data/camps.json'
import { fetchForecast } from '@/lib/weather'
import type { Campsite } from '@/types'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const camps = campsData as Campsite[]
  const results: { id: string; status: string }[] = []

  for (const camp of camps) {
    try {
      const forecast = await fetchForecast(camp.lat, camp.lng)
      const { error: upsertError } = await supabaseAdmin.from('weather_cache').upsert({
        campsite_id: camp.id,
        forecast,
        updated_at: new Date().toISOString(),
      })
      if (upsertError) throw new Error(upsertError.message)
      results.push({ id: camp.id, status: 'ok' })
    } catch (e) {
      console.error(`Weather fetch failed for ${camp.id}:`, e)
      results.push({ id: camp.id, status: 'error' })
    }
  }

  return NextResponse.json({ updated: results.length, results })
}
