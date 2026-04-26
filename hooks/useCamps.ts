import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Campsite, CampsiteFilter } from '@/types'

export function useCamps(filter: CampsiteFilter): { camps: Campsite[]; loading: boolean } {
  const [allCamps, setAllCamps] = useState<Campsite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('campsites')
      .select('*')
      .then(({ data }) => {
        if (data) setAllCamps(data as Campsite[])
        setLoading(false)
      })
  }, [])

  const camps = useMemo(() => {
    return allCamps.filter(camp => {
      if (filter.area && camp.area !== filter.area) return false
      if (filter.price_range === 'budget' && camp.price_min > 2000) return false
      if (filter.price_range === 'mid' && (camp.price_min < 2001 || camp.price_min > 4000)) return false
      if (filter.price_range === 'premium' && camp.price_min < 4001) return false
      if (filter.amenities.length > 0) {
        if (!filter.amenities.every(a => camp.amenities.includes(a))) return false
      }
      if (filter.search) {
        const q = filter.search.toLowerCase()
        if (!camp.name.toLowerCase().includes(q) && !camp.area.includes(filter.search)) return false
      }
      return true
    })
  }, [allCamps, filter])

  return { camps, loading }
}
