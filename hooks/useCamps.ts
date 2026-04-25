import { useMemo } from 'react'
import campsData from '@/data/camps.json'
import type { Campsite, CampsiteFilter } from '@/types'

export function useCamps(filter: CampsiteFilter): Campsite[] {
  const camps = campsData as Campsite[]

  return useMemo(() => {
    return camps.filter(camp => {
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
  }, [camps, filter])
}
