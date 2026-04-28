import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Campsite } from '@/types'

export function useCamp(id: string): { camp: Campsite | null; loading: boolean } {
  const [camp, setCamp] = useState<Campsite | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('campsites')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setCamp(data as Campsite | null)
        setLoading(false)
      })
  }, [id])

  return { camp, loading }
}
